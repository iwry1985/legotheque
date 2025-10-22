import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-item-list',
  imports: [CommonModule],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList {
  theme = input<string>();
  themeName = input<string>();
  banner = input<string>();
  name = input.required<string>();
  hideThemeIfNoPic = input<boolean>(false);
  set = input<boolean>(false);
}
