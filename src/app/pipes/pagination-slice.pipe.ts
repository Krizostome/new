import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: false,
    name: 'paginationSlice',
})
export class PaginationSlicePipe implements PipeTransform {

  transform(datas: any[], startPage: number, endPage: number): any {
    if (!datas) return [];
    return datas.slice(startPage, endPage);
  }


}
