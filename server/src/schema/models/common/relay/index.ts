export type ID = string;

export class PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: ID
  endCursor: ID
  constructor(hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: ID, endCursor?: ID) {
    this.hasNextPage = hasNextPage;
    this.hasPreviousPage = hasPreviousPage;
    this.startCursor = startCursor;
    this.endCursor = endCursor;
  }
}
