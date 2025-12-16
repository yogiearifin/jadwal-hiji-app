export type RegionType =
  | "northtown"
  | "westville"
  | "downtown"
  | "docks"
  | "suburbia"
  | "uptown";

export interface IRegion {
  id: string;
  region_name: RegionType;
  region_base_budget: number;
  region_dealer: string;
  region_supplier: string;
  product_standard: number;
  region_level: string;
  customers: number;
  image_url: string;
  region_max_budget: number;
}
