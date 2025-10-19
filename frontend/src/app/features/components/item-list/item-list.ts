import { Component, input } from '@angular/core';

@Component({
  selector: 'app-item-list',
  imports: [],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList {
  theme = input<string>();
  themeName = input<string>();
  banner = input<string>();
  name = input.required<string>();
}
