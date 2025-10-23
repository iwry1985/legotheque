import { Component, input } from '@angular/core';
import { ICondition } from 'app/features/models/secondary-market.model';

@Component({
  selector: 'app-secondary-market',
  imports: [],
  templateUrl: './secondary-market.html',
  styleUrl: './secondary-market.scss',
})
export class SecondaryMarket {
  section = input.required<string>();
  prices = input.required<ICondition>();

  isValidNumber = (value?: any): any => {
    const num = Number(value);

    if (num && !Number.isNaN(num)) return value;
    else return '—';
  };
}
