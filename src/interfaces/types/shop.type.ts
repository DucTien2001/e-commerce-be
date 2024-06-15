export type TShopFindByEmail = {
  email: string;
  select?: string | string[] | Record<string, number | boolean | string | object>;
};
