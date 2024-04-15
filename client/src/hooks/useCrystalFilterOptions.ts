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
    rarityOptions: {
      label: "Rarity",
      options: rarityOptions.reduce((acc, rarity) => {
        return { ...acc, [rarity]: { name: rarity, value: true } }
      }, {}),
    },
    findAgeOptions: {
      label: "Find Age",
      options: findAgeOptions.reduce((acc, findAge) => {
        return { ...acc, [findAge]: { name: findAge, value: true } }
      }, {}),
    },
    sizeOptions: {
      label: "Size",
      options: sizeOptions.reduce((acc, size) => {
        return { ...acc, [size]: { name: size, value: true } }
      }, {}),
    },
    inventoryOptions: {
      label: "Inventory",
      options: inventoryOptions.reduce((acc, inventory) => {
        return { ...acc, [inventory]: { name: inventory, value: true } }
      }, {}),
    },
    categoryOptions: {
      label: "Category",
      options: categoryOptions.reduce((acc, category) => {
        return { ...acc, [category]: { name: category, value: true } }
      }, {}),
    },
    locationOptions: {
      label: "Location",
      options: locationOptions.reduce((acc, location) => {
        return { ...acc, [location]: { name: location, value: true } }
      }, {}),
    },
    colorOptions: {
      label: "Color",
      options: colorOptions.reduce((acc, color) => {
        return { ...acc, [color.name]: { name: color.name, value: true } }
      }, {}),
    },
  }

  return {
    ...crystalFilterOptions,
    crystalFilterOptions,
  }
}

export default useCrystalFilterOptions
