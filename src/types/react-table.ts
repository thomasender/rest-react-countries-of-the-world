import { TableInstance, Row, TableState } from 'react-table';

// Extend the TableState type to include the properties added by usePagination
interface TableStateWithPagination<D extends object = {}> extends TableState<D> {
  pageIndex: number;
  pageSize: number;
}

// Extend the TableInstance type to include the properties added by usePagination
export interface TableInstanceWithPagination<D extends object = {}> extends Omit<TableInstance<D>, 'state'> {
  page: Array<Row<D>>;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: number[];
  pageCount: number;
  gotoPage: (updater: ((pageIndex: number) => number) | number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (pageSize: number) => void;
  state: TableStateWithPagination<D>;
}