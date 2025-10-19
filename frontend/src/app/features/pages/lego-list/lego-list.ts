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
  ],
  templateUrl: './lego-list.html',
  styleUrl: './lego-list.scss',
})
export class LegoList implements OnInit {
  private readonly _legosetService: LegosetService = inject(LegosetService);
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  filters = signal({ page: 1 });
  legosets: any = this._legosetService.getList(this.filters);
  form = this._fb.group({
    themeid: [''],
    search: [''],
  });

  ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe({
      next: (p) => this.filters.set({ ...p, page: 1 }),
    });
  }

  @ViewChild('paginator') //Correspond à l'id #paginator
  private _paginator!: Paginator;

  changePage = (state: PaginatorState) => {
    this.filters.update((f) => ({ ...f, page: (state.page ?? 0) + 1 })); //page start at 0
  };

  search = () => {
    // on enlève les clés dont la valeur est null ou undefined
    const cleanFilters = Object.fromEntries(
      Object.entries(this.form.value).filter(
        ([_, v]) => v !== null && v !== undefined && v !== ''
      )
    );

    console.log('cleanFilters', cleanFilters, this.form.value);

    this.filters.set({ ...cleanFilters, page: 1 });

    this._paginator.changePage(0);
  };

  goToDetails = (legosetid: number) => {
    this._router.navigateByUrl(`lego/${legosetid}`);
  };
}
