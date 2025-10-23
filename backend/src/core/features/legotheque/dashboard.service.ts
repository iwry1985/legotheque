import { Injectable } from '@nestjs/common';
import { LegothequeService } from './legotheque.service';
import { first } from 'rxjs';
import { DashboardDto } from 'src/core/models/dto/legotheque/dashboard.dto';
import { MoreThanOrEqual } from 'typeorm';

@Injectable()
export class DashboardService {
    constructor(private readonly _legothequeService: LegothequeService) {}

    getDashboard = async (
        userid: number,
        range: 'all' | 'year' | 'month' = 'all'
    ): Promise<DashboardDto | { message: string }> => {
        const now = new Date();
        let from: Date | undefined;

        switch (range) {
            case 'year':
                from = new Date(now.getFullYear(), 0, 1);
                break;
            case 'month':
                from = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                from = undefined;
        }

        const collection = await this._legothequeService.getLegotheque(userid, {
            ...(from && { ownedat: MoreThanOrEqual(from) }),
        });
        if (!collection.length) return { message: 'Aucune donnée' };

        return this.buildDashboard(collection);
    };

    private buildDashboard = (collection: any[]): DashboardDto => {
        //prepare data
        const purchasesByMonth = new Map<
            string,
            { count: number; total: number; gifts: number }
        >();
        const themeCount = new Map<string, number>();
        const minifigs = { with: 0, without: 0 };
        const priceRange = new Map<string, number>();
        const pieceRange = new Map<string, number>();
        const builtOverTime = new Map<string, number>();
        const builtThemes = new Map<string, number>();
        let totalValue = 0;
        let totalBuilt = 0;
        let totalPieces = 0;
        let totalGifts = 0;

        for (const c of collection) {
            const set = c.set;
            if (!set) continue;

            const purchaseDate = c.ownedat ? new Date(c.ownedat) : null;
            const price = Number(c.purchaseprice || set.retailprice || 0);
            const pieces = set.pieces || 0;
            const theme = set.theme?.name || 'Autre';
            const isGift = c.gift;

            //nbr de cadeaux reçus par mois
            if (isGift) totalGifts++;

            //Nbr Achats/prix par mois
            if (purchaseDate) {
                const month = String(purchaseDate.getMonth() + 1).padStart(
                    2,
                    '0'
                );
                const key = `${purchaseDate.getFullYear()}-${month}`;
                const g = purchasesByMonth.get(key) || {
                    count: 0,
                    total: 0,
                    gifts: 0,
                };

                g.count++;
                if (isGift) g.gifts++;
                else g.total += price;
                purchasesByMonth.set(key, g);
            }

            //thèmes
            const countTheme = (themeCount.get(theme) || 0) + 1;
            themeCount.set(theme, countTheme);

            //minifigs
            if (set.minifigs && set.minifigs > 0) minifigs.with++;
            else minifigs.without++;

            //valeur estimée
            if (!isGift) totalValue += price;

            //taille/pièces
            if (pieces) {
                totalPieces += pieces;
                const pRange = this.getPieceRange(pieces);
                const value = (pieceRange.get(pRange) || 0) + 1;
                pieceRange.set(pRange, value);
            }

            //price range
            if (price) {
                const prRange = this.getPriceRange(price);
                const prValue = (priceRange.get(prRange) || 0) + 1;
                priceRange.set(prRange, prValue);
            }

            //progression construction
            if (c.built && c.builtat) {
                const bKey = `${new Date(c.builtat).getFullYear()}-${String(
                    new Date(c.builtat).getMonth() + 1
                ).padStart(2, '0')}`;

                builtOverTime.set(bKey, (builtOverTime.get(bKey) || 0) + 1);
                totalBuilt++;
                builtThemes.set(theme, (builtThemes.get(theme) || 0) + 1);
            }
        }

        //formatage pour chart js
        const purchaseSorted = [...purchasesByMonth.entries()].sort();
        const labels = purchaseSorted.map(([key]) => key);
        const counts = purchaseSorted.map(([_, v]) => v.count);
        const total = purchaseSorted.map(([_, v]) => v.total);
        const gifts = purchaseSorted.map(([_, v]) => v.gifts);

        const progressionLabels = [...builtOverTime.keys()].sort();
        const progressionValues = this.accumulate([...builtOverTime.values()]);

        const themesSorted = [...themeCount.entries()].sort(
            (a, b) => b[1] - a[1]
        );

        const builtThemesSorted = [...builtThemes.entries()].sort(
            (a, b) => b[1] - a[1]
        );

        const priceHistLabels = [...priceRange.keys()];
        const priceHistData = [...priceRange.values()];

        const pieceHistLabels = [...pieceRange.keys()];
        const pieceHistData = [...pieceRange.values()];

        //create & return DashboardDTO
        return {
            summary: {
                totalSets: collection.length,
                totalBuilt,
                totalGifts,
                totalValue: Math.round(totalValue * 100) / 100,
                avgPieces: Math.round(totalPieces / collection.length),
                builtRatio: collection.length
                    ? Math.round((totalBuilt / collection.length) * 100)
                    : 0,
                giftsRatio: Math.round((totalGifts / collection.length) * 100),
            },
            purchases: {
                labels,
                datasets: [
                    {
                        label: "Nombre d'achats",
                        data: counts,
                        type: 'bar',
                    },
                    {
                        label: 'Cadeaux',
                        data: gifts,
                        type: 'bar',
                    },
                    {
                        label: 'Montant total (€)',
                        data: total,
                        type: 'line',
                    },
                ],
            },
            themes: {
                labels: themesSorted.map(([theme]) => theme),
                datasets: [{ data: themesSorted.map(([_, count]) => count) }],
            },
            minifigs: {
                labels: ['Avec minifigs', 'Sans minifigs'],
                datasets: [{ data: [minifigs.with, minifigs.without] }],
            },
            priceHistogram: {
                labels: priceHistLabels,
                datasets: [{ label: 'Sets', data: priceHistData }],
            },
            piecesHistogram: {
                labels: pieceHistLabels,
                datasets: [{ label: 'Sets', data: pieceHistData }],
            },
            progression: {
                labels: progressionLabels,
                datasets: [
                    {
                        label: 'Sets construits cumulés',
                        data: progressionValues,
                        type: 'line',
                    },
                ],
            },
            tops: {
                themesBuilt: builtThemesSorted
                    .slice(0, 5)
                    .map(([theme, count]) => ({
                        label: theme,
                        value: count,
                    })),
                expensiveSets: collection
                    .filter((c) => {
                        const price = c.purchaseprice || c.set.retailprice;
                        return !c.gift && price;
                    })
                    .sort((a, b) => {
                        const aPrice = Number(
                            a.purchaseprice || a.set.retailprice || 0
                        );
                        const bPrice = Number(
                            b.purchaseprice || b.set.retailprice || 0
                        );

                        return bPrice - aPrice;
                    })
                    .slice(0, 5)
                    .map((c) => ({
                        name: c.set.name,
                        price: Number(
                            c.purchaseprice || c.set.retailprice || 0
                        ),
                    })),
            },
        };
    };

    private getPriceRange = (price: number): string => {
        if (price < 50) return '0-50€';
        if (price < 100) return '50-100€';
        if (price < 200) return '100-200€';
        if (price < 300) return '200-300€';
        if (price < 400) return '300-400€';
        if (price < 500) return '400-500€';
        return '500€+';
    };

    private getPieceRange = (pieces: number): string => {
        if (pieces < 500) return '0-500';
        if (pieces < 1000) return '500-1000';
        if (pieces < 2000) return '1000-2000';
        if (pieces < 3000) return '2000-3000';
        return '3000+';
    };

    private accumulate = (arr: number[]): number[] => {
        let sum = 0;

        return arr.map((v) => (sum += v));
    };
}
