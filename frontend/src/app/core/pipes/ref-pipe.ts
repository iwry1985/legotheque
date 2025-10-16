import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ref',
})
export class RefPipe implements PipeTransform {
  transform(value: unknown): unknown {
    return `#${value}`;
  }
}
