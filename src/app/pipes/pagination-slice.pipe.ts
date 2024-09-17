import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginationSlice'
})
export class PaginationSlicePipe implements PipeTransform {

  transform(datas: any[], startPage: number, endPage: number): any {
    return datas.slice(startPage, endPage);
  }


}
