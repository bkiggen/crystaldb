import { useEffect, useState } from "react"

import { getAllColors } from "../api/colors"

import {
  rarityOptions,
  findAgeOptions,
  sizeOptions,
  inventoryOptions,
  categoryOptions,
  locationOptions,
} from "../types/Crystal"
import { ColorT } from "../types/Color"

const useCrystalFilterOptions = () => {
  const [colorOptions, setColorOptions] = useState<ColorT[]>([])

  useEffect(() => {
    const fetchColorOptions = async () => {
      const colorOptions = await getAllColors()
      setColorOptions(colorOptions)
    }

    fetchColorOptions()
  }, [])

  const crystalFilterOptions = {
    rarity: {
      label: "Rarity",
      options: rarityOptions.reduce((acc, rarity) => {
        return { ...acc, [rarity]: { name: rarity, selected: true, value: rarity } }
      }, {}),
    },
    findAgeOptions: {
      label: "Find Age",
      options: findAgeOptions.reduce((acc, findAge) => {
        return { ...acc, [findAge]: { name: findAge, selected: true, value: findAge } }
      }, {}),
    },
    size: {
      label: "Size",
      options: sizeOptions.reduce((acc, size) => {
        return { ...acc, [size]: { name: size, selected: true, value: size } }
      }, {}),
    },
    inventory: {
      label: "Inventory",
      options: inventoryOptions.reduce((acc, inventory) => {
        return { ...acc, [inventory]: { name: inventory, selected: true, value: inventory } }
      }, {}),
    },
    category: {
      label: "Category",
      options: categoryOptions.reduce((acc, category) => {
        return { ...acc, [category]: { name: category, selected: true, value: category } }
      }, {}),
    },
    location: {
      label: "Location",
      options: locationOptions.reduce((acc, location) => {
        return { ...acc, [location]: { name: location, selected: true, value: location } }
      }, {}),
    },
    color: {
      label: "Color",
      dbLabel: "colorId",
      options: colorOptions.reduce((acc, color) => {
        return { ...acc, [color.id]: { name: color.name, selected: true, value: color.id } }
      }, {}),
    },
  }

  return {
    ...crystalFilterOptions,
    crystalFilterOptions,
  }
}

export default useCrystalFilterOptions
