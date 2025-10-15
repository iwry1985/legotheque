import { Component, inject, signal, ViewChild } from '@angular/core';
import { LegosetService } from 'app/features/services/legoset-service';
import { TableModule } from 'primeng/table';
import { Paginator, PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-lego-list',
  imports: [
    InputText,
    TableModule,
    PaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './lego-list.html',
  styleUrl: './lego-list.css',
})
export class LegoList {
  private readonly _legosetService: LegosetService = inject(LegosetService);
  private readonly _fb = inject(FormBuilder);

  @ViewChild('paginator') //Correspond à l'id #paginator
  private _paginator!: Paginator;

  filters = signal({ page: 1 });
  legosets: any = this._legosetService.getList(this.filters);
  form = this._fb.group({
    themeid: [null],
    search: [''],
  });

  changePage = (state: PaginatorState) => {
    this.filters.update((f) => ({ ...f, page: (state.page ?? 0) + 1 })); //page start at 0
  };

  search = () => {
    // on enlève les clés dont la valeur est null ou undefined
    const cleanFilters = Object.fromEntries(
      Object.entries(this.form.value).filter(([_, v]) => v != null)
    );

    this.filters.set({ ...cleanFilters, page: 1 });

    this._paginator.changePage(0);
  };
}
