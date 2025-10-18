import { DatePipe } from '@angular/common';
import { Component, computed, input, OnInit } from '@angular/core';
import { ILegotheque } from 'app/features/models/legotheque.model';

@Component({
  selector: 'app-lego-summary',
  imports: [DatePipe],
  templateUrl: './lego-summary.html',
  styleUrl: './lego-summary.scss',
})
export class LegoSummary {
  myLego = input.required<ILegotheque>();
  inProgress = computed(() => {
    console.log('inProgress');
    const today = new Date();
    const beginBuiltAt = this.myLego().builtbeginat;
    const builtat = this.myLego().builtat;

    if (!beginBuiltAt) return 0;

    const end = builtat ? new Date(builtat) : today;
    const diff = end.getTime() - new Date(beginBuiltAt).getTime();

    return Math.floor(diff / (1000 * 60 * 60 * 24));
  });
}
