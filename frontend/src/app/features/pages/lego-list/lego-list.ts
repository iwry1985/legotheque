import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { LegosetService } from 'app/features/services/legoset.service';
import { TableModule } from 'primeng/table';
import { Paginator, PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemList } from 'app/features/components/item-list/item-list';
import { SelectModule } from 'primeng/select';
import { ThemeService } from 'app/features/services/theme.service';
import { ITheme } from 'app/features/models/theme.model';
import { SliderModule } from 'primeng/slider';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-lego-list',
  imports: [
    InputText,
    TableModule,
    PaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    ItemList,
    RouterLink,
    SelectModule,
    SliderModule,
    ToggleSwitchModule,
  ],
  templateUrl: './lego-list.html',
  styleUrl: './lego-list.scss',
})
export class LegoList implements OnInit {
  private readonly _legosetService: LegosetService = inject(LegosetService);
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _themeService = inject(ThemeService);

  filters: any = signal({ page: 1 });
  legosets: any = this._legosetService.getList(this.filters);
  filterForm = this._fb.group({
    themeid: [''],
    search: [''],
    rangePieces: [[0, 12000] as number[]],
    rangeAge: [[4, 18] as number[]],
    adultOnly: [false],
  });
  themes: ITheme[] = [];

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe({
      next: (p) =>
        this.filters.set({ ...p, page: 1, sortBy: 'year', sort: 'DESC' }),
    });

    this._themeService.getThemes().subscribe({
      next: (res) => {
        this.themes = res;
      },
    });
  }

  @ViewChild('paginator') //Correspond à l'id #paginator
  private _paginator!: Paginator;

  changePage = (state: PaginatorState) => {
    this.filters.update((f: any) => ({
      ...f,
      page: (state.page ?? 0) + 1,
      sortBy: 'year',
      sort: 'DESC',
    })); //page start at 0

    this.updateQueryParams(this.filters());
  };

  handleRangle = (
    type: string,
    min: string,
    max: string
  ): { [min]: number; [max]: number } => {
    const rangeField =
      type === 'pieces'
        ? this.filterForm.get('rangePieces')?.value
        : this.filterForm.get('rangeAge')?.value;

    console.log('rangeField', rangeField);

    const [minValue, maxValue] = rangeField
      ? rangeField
      : [type === 'pieces' ? 0 : 4, type === 'pieces' ? 12000 : 18];

    console.log(minValue, maxValue);

    return {
      [min]: minValue ? minValue : type === 'pieces' ? 0 : 4,
      [max]: maxValue ? maxValue : type === 'pieces' ? 12000 : 18,
    };
  };

  search = () => {
    // on enlève les clés dont la valeur est null ou undefined
    let cleanFilters: {
      [k: string]: string | number | boolean | number[] | null;
    } = Object.fromEntries(
      Object.entries(this.filterForm.value).filter(
        ([_, v]) => v !== null && v !== undefined && v !== ''
      )
    );

    if (this.filterForm.get('rangePieces')?.touched) {
      const range = this.handleRangle('pieces', 'minPieces', 'maxPieces');

      cleanFilters = { ...cleanFilters, ...range };
    }

    console.log('touched', this.filterForm.get('rangeAge')?.touched);

    if (
      this.filterForm.get('rangeAge')?.touched &&
      !this.filterForm.value.adultOnly
    ) {
      const range = this.handleRangle('age', 'minAge', 'maxAge');

      cleanFilters = { ...cleanFilters, ...range };
    }

    const { rangePieces, rangeAge, ...filtered } = cleanFilters;

    console.log('filtered', filtered);

    this.filters.set({ ...filtered, page: 1 });

    this._paginator.changePage(0);

    this.updateQueryParams(filtered);
  };

  goToDetails = (legosetid: number) => {
    this._router.navigateByUrl(`lego/${legosetid}`);
  };

  private updateQueryParams = (filters: any): void => {
    this._router.navigate([], {
      queryParams: filters,
      queryParamsHandling: 'merge',
    });
  };
}
