import { useEffect } from "react"

import { useColorStore } from "../store/colorStore"

import { inventoryOptions, categoryOptions, locationOptions } from "../types/Crystal"

const useCrystalFilterOptions = () => {
  const { colors, fetchColors } = useColorStore()

  useEffect(() => {
    fetchColors()
  }, [])

  const crystalFilterOptions = {
    // rarity: {
    //   label: "Rarity",
    //   options: rarityOptions.reduce((acc, rarity) => {
    //     return { ...acc, [rarity]: { name: rarity, selected: true, value: rarity } }
    //   }, {}),
    // },
    // findAgeOptions: {
    //   label: "Find Age",
    //   options: findAgeOptions.reduce((acc, findAge) => {
    //     return { ...acc, [findAge]: { name: findAge, selected: true, value: findAge } }
    //   }, {}),
    // },
    // size: {
    //   label: "Size",
    //   options: sizeOptions.reduce((acc, size) => {
    //     return { ...acc, [size]: { name: size, selected: true, value: size } }
    //   }, {}),
    // },
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
      options: colors.reduce((acc, color) => {
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
