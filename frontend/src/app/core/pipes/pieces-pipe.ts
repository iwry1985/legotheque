import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pieces',
})
export class PiecesPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return value + ' pièces';
  }
}
