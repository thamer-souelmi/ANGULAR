import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByDate'
})
export class FilterByDatePipe implements PipeTransform {
  transform(items: any[], date: Date): any[] {
    return items.filter(item => new Date(item.start).toDateString() === new Date(date).toDateString());
  }
}
