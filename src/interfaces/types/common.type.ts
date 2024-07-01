export type TFindPagination = {
  limit: number;
  page: number;
  sort?: string;
  filter?: any;
  select?: string[];
};

export type TFind = {
  query: any;
  limit: number;
  skip: number;
};

export type TSearch = {
  keySearch: string;
};
