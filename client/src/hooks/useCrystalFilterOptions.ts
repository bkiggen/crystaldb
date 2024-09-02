import { useEffect } from "react"

import { useColorStore } from "../store/colorStore"
import { useCategoryStore } from "../store/categoryStore"
import { useLocationStore } from "../store/locationStore"

import { inventoryOptions } from "../types/Crystal"

type Props = {
  defaultFilteredOut?: {
    inventory?: string[]
    category?: string[]
    location?: string[]
    color?: number[]
  }
}

const useCrystalFilterOptions = ({ defaultFilteredOut = {} }: Props) => {
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
        const isFilteredOut = defaultFilteredOut.inventory?.includes(inventory) || false // Check if inventory item is in defaultFilteredOut
        return {
          ...acc,
          [inventory]: { name: inventory, selected: !isFilteredOut, value: inventory },
        }
      }, {}),
    },
    category: {
      label: "Category",
      options: categories.reduce((acc, category) => {
        const isFilteredOut = defaultFilteredOut.category?.includes(category.name) || false // Check if category name is in defaultFilteredOut
        return {
          ...acc,
          [category.name]: { name: category.name, selected: !isFilteredOut, value: category.id },
        }
      }, {}),
    },
    location: {
      label: "Location",
      options: locations.reduce((acc, location) => {
        const isFilteredOut = defaultFilteredOut.location?.includes(location.name) || false // Check if location name is in defaultFilteredOut
        return {
          ...acc,
          [location.name]: { name: location.name, selected: !isFilteredOut, value: location.id },
        }
      }, {}),
    },
    color: {
      label: "Color",
      dbLabel: "colorId",
      options: colors.reduce((acc, color) => {
        const isFilteredOut = defaultFilteredOut.color?.includes(color.id) || false // Check if color ID is in defaultFilteredOut
        return {
          ...acc,
          [color.id]: { name: color.name, selected: !isFilteredOut, value: color.id },
        }
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
