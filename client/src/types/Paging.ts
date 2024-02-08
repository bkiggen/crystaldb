export type PagingT = {
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize?: number
}

export const defaultPaging = {
  totalCount: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 0,
}
