import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {
  transform(value: string[] | undefined, separator: string = ', '): string {
    // Check if 'value' is undefined and return an empty string or any other default value
    if (!value) {
      return '';  // or return 'No equipment' or any other placeholder
    }
    return value.join(separator);
  }
}
