import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { omit } from 'app/core/utilitaires/obj-utils.utils';
import { ILegoset } from 'app/features/models/legoset.model';
import {
  ILegotheque,
  UPDATE_LEGOTHEQUE_OMIT_KEYS,
} from 'app/features/models/legotheque.model';
import { LegothequeService } from 'app/features/services/legotheque.service';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InplaceModule } from 'primeng/inplace';
import { InputText } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-lego-collection',
  imports: [
    ToggleSwitchModule,
    FormsModule,
    DatePickerModule,
    InplaceModule,
    InputText,
    AutoFocusModule,
    ButtonModule,
    CurrencyPipe,
  ],
  templateUrl: './lego-collection.html',
  styleUrl: './lego-collection.scss',
})
export class LegoCollection implements OnInit {
  private readonly _legothequeService: LegothequeService =
    inject(LegothequeService);

  legoset = input.required<ILegoset>();
  myLego = input.required<ILegotheque>();
  updateLegotheque = output<ILegotheque>();

  maxDate: Date = new Date();
  minDate!: Date | undefined;
  editMode = false;
  newPrice: number | undefined = 0;
  ownedat!: Date | undefined;
  builtbeginat!: Date | null;
  builtat: Date | undefined;
  minDateBuilt!: Date | undefined;

  keys: string[] = ['ownedat', 'builtbeginat', 'builtat'];

  ngOnInit(): void {
    const legoset = this.legoset();
    const myLego = this.myLego();

    this.minDate = legoset?.launchdate
      ? new Date(legoset.launchdate)
      : legoset?.year
      ? new Date(legoset.year, 0, 1)
      : undefined;

    this.newPrice = myLego.purchaseprice
      ? myLego.purchaseprice
      : legoset.retailprice
      ? legoset.retailprice
      : 0;

    this.minDateBuilt = myLego.builtbeginat && new Date(myLego.builtbeginat);

    this.keys.forEach((key: string) => {
      const field = this.myLego()[key as keyof ILegotheque];

      if (field) (this as any)[key] = new Date(field as Date);
    });
  }

  updateLego = (updated?: Partial<ILegotheque>) => {
    const lego = { ...this.myLego() };

    type LegoKey = keyof ILegotheque;

    let body: Partial<ILegotheque> = { ...lego, ...updated };

    this.keys.forEach((key) => {
      const k = key as LegoKey;
      const value = (this as any)[k] as ILegotheque[LegoKey];
      (body as any)[k] = value;
    });

    body = omit(body, UPDATE_LEGOTHEQUE_OMIT_KEYS);

    this._legothequeService
      .updateCollection(this.myLego().legothequeid, body)
      .subscribe({
        next: (res) => this.updateLegotheque.emit(res),
      });
  };

  savePrice() {
    const purchasePrice = Number(this.newPrice);
    this.myLego().purchaseprice = purchasePrice;
    this.editMode = false;

    this.updateLego();
  }

  cancelEdit() {
    this.editMode = false;
  }

  built(undone?: boolean) {
    const section = document.querySelector('.build') as HTMLElement;
    if (section) {
      section.classList.add('fade-out');
      setTimeout(() => {
        this.myLego().built = !this.myLego().built;
        this.updateLego();
        section.classList.remove('fade-out');
        section.classList.add('fade-in');
        setTimeout(() => section.classList.remove('fade-in'), 300);
      }, 300);
    }
  }
}
