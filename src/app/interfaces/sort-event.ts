export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1: any, v2: any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string;
  direction: SortDirection;
}
