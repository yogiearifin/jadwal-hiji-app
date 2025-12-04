export type ProductType = "weed" | "meth" | "coke";
export type RegionType =
  | "Northtown"
  | "Westville"
  | "Downtown"
  | "Docks"
  | "Suburbia"
  | "Uptown";

export interface ICustomer {
  base_budget: number;
  created_at: string;
  has_low_product_affinity: boolean;
  hated_products: ProductType;
  id: string;
  img_url: string;
  is_top_spender: boolean;
  name: string;
  preferred_products: ProductType;
  product_standard: number;
  region: RegionType;
  trivia: string[];
  max_budget: number;
}

export interface IRanks {
  id: string;
  created_at: string;
  rank_name: string;
  rank: number;
}
