import { ColorT } from "./Color"

export const rarity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const
export type RarityT = (typeof rarity)[keyof typeof rarity]
export const rarityOptions = Object.values(rarity)

export const findAge = {
  NEW: "NEW",
  OLD: "OLD",
  DEAD: "DEAD",
} as const
export type FindAgeT = (typeof findAge)[keyof typeof findAge]
export const findAgeOptions = Object.values(findAge)

export const size = {
  XS: "XS",
  S: "S",
  M: "M",
  L: "L",
  XL: "XL",
} as const
export type SizeT = (typeof size)[keyof typeof size]
export const sizeOptions = Object.values(size)

export const inventory = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
  OUT: "OUT",
} as const
export type InventoryT = (typeof inventory)[keyof typeof inventory]
export const inventoryOptions = Object.values(inventory)

export const category = {
  TUMBLED: "TUMBLED",
  TOWER: "TOWER",
  PALM_STONE: "PALM STONE",
  POINT: "POINT",
  CLUSTER: "CLUSTER",
  RAW: "RAW",
  JEWELRY: "JEWELRY",
} as const
export type CategoryType = (typeof category)[keyof typeof category]
export const categoryOptions = Object.values(category)

export type CrystalT = {
  id: number
  name: string
  color?: ColorT
  colorId?: number
  category?: string
  rarity?: RarityT
  description?: string
  image?: string
  findAge?: FindAgeT
  createdAt?: string
  inventory?: InventoryT
  updatedAt?: string
  size?: SizeT
}
