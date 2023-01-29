export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
}
type JoinType = 'INNER' | 'LEFT' | 'RIGHT';
interface FilterField {
  field: string;
  joinType: JoinType;
  value: any;
  operation: string;
  values: any[];
  alternatives: FilterField[];
}
type Direction = 'ASC' | 'DESC';
export interface SearchCriteria {
  filterFields: FilterField[];
  advancedSearch?: boolean;
  searchTerm?: string;
  sortedBy?: string;
  direction?: Direction;
  pageNum?: number;
  pageSize?: number;
}
export const getInitialPage = <T>(): Page<T> => {
  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    last: true,
    size: 10,
    number: 0,
    numberOfElements: 0,
    first: true,
    empty: true,
    sort: { empty: true, sorted: true, unsorted: false }
  };
};
