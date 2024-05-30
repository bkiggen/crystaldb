import { useEffect } from "react"

import { useColorStore } from "../store/colorStore"
import { useCategoryStore } from "../store/categoryStore"
import { useLocationStore } from "../store/locationStore"

import { inventoryOptions } from "../types/Crystal"

const useCrystalFilterOptions = () => {
  const { colors, fetchColors } = useColorStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { locations, fetchLocations } = useLocationStore()

  useEffect(() => {
    fetchColors()
    fetchCategories()
    fetchLocations()
  }, [])

  const crystalFilterOptions = {
    inventory: {
      label: "Inventory",
      options: inventoryOptions.reduce((acc, inventory) => {
        return { ...acc, [inventory]: { name: inventory, selected: true, value: inventory } }
      }, {}),
    },
    category: {
      label: "Category",
      options: categories.reduce((acc, category) => {
        return {
          ...acc,
          [category.name]: { name: category.name, selected: true, value: category.id },
        }
      }, {}),
    },
    location: {
      label: "Location",
      options: locations.reduce((acc, location) => {
        return {
          ...acc,
          [location.name]: { name: location.name, selected: true, value: location.id },
        }
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

  const noColors = Object.keys(crystalFilterOptions.color.options).length === 0
  const noLocations = Object.keys(crystalFilterOptions.location.options).length === 0
  const noCategories = Object.keys(crystalFilterOptions.category.options).length === 0

  if (noColors || noLocations || noCategories) {
    return { crystalFilterOptions: {} }
  }

  return {
    ...crystalFilterOptions,
    crystalFilterOptions,
  }
}

export default useCrystalFilterOptions
