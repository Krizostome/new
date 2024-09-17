import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {SortDirection, SortEvent} from "../interfaces/sort-event";

/*@Directive({
  selector: '[appNgbdSortableHeader]'
})
export class NgbdSortableHeaderDirective {

  constructor() { }

}*/

const rotate: {[key: string]: SortDirection} = { asc: 'desc', desc: '', '': 'asc' };

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})


// tslint:disable-next-line:directive-class-suffix
export class NgbdSortableHeader {

  @Input() sortable: string = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}
