import { ColorT } from "./Color";

export type RarityT = "LOW" | "MEDIUM" | "HIGH";

export type FindAgeT = "NEW" | "OLD" | "DEAD";

export type CrystalT = {
  id?: number;
  name: string;
  color?: ColorT;
  colorId?: number;
  category?: string;
  rarity?: RarityT;
  description?: string;
  image?: string;
  findAge?: FindAgeT;
  createdAt?: string;
};
