import { DatePipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { ILegotheque } from 'app/features/models/legotheque.model';

@Component({
  selector: 'app-lego-summary',
  imports: [DatePipe],
  templateUrl: './lego-summary.html',
  styleUrl: './lego-summary.scss',
})
export class LegoSummary implements OnInit {
  myLego = input.required<ILegotheque>();
  inProgress: number = 0;

  ngOnInit(): void {
    const today = new Date();
    const beginBuiltAt = this.myLego().builtbeginat;

    if (beginBuiltAt && !this.myLego().built) {
      const diff = today.getTime() - new Date(beginBuiltAt).getTime();
      this.inProgress = Math.floor(diff / (1000 * 60 * 60 * 24));
    }
  }
}
