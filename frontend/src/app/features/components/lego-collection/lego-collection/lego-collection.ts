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

  //maxdate for ownedat
  maxDate: Date = new Date();
  minDate!: Date | undefined;
  editMode = false;
  newPrice: number | undefined = 0;
  ownedat!: Date | undefined;

  ngOnInit(): void {
    const legoset = this.legoset();
    this.minDate = legoset?.launchdate
      ? new Date(legoset.launchdate)
      : legoset?.year
      ? new Date(legoset.year, 0, 1)
      : undefined;

    this.newPrice = this.myLego().purchaseprice
      ? this.myLego().purchaseprice
      : this.legoset().retailprice
      ? this.legoset().retailprice
      : 0;

    const legoOwnedAt = this.myLego().ownedat;
    if (legoOwnedAt) this.ownedat = new Date(legoOwnedAt);
  }

  updateLego = () => {
    if (this.ownedat) this.myLego().ownedat = this.ownedat;
    const body = omit(this.myLego(), UPDATE_LEGOTHEQUE_OMIT_KEYS);

    this._legothequeService
      .updateCollection(this.myLego().legothequeid, body)
      .subscribe({
        next: (res) => this.updateLegotheque.emit(res),
      });
  };

  savePrice() {
    this.myLego().purchaseprice = this.newPrice;
    this.editMode = false;

    this.updateLego();
  }

  cancelEdit() {
    this.editMode = false;
  }
}
