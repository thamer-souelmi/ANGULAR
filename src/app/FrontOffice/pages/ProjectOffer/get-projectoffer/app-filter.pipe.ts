import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter' ,
pure: false // Set to false to re-evaluate the pipe whenever change detection runs

})
export class FilterPipe implements PipeTransform {
 transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText || searchText.trim().length === 0) {
      return items; // Return all items if searchText is empty or only contains whitespace
    }
    searchText = searchText.toLowerCase();

    return items.filter(it => {
      // Convert the project offer object to a string representation
      // that includes all its properties, then check if it includes the search text
      const itemStr = JSON.stringify(it).toLowerCase();
      return itemStr.includes(searchText);
    });
 }
}
