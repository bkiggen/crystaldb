import { useMemo, useState, useEffect } from "react"
import { Box, Typography, Menu, MenuItem, IconButton, Checkbox } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import { isEmpty } from "lodash"

import colors from "../../styles/colors"

import useCrystalFilterOptions from "../../hooks/useCrystalFilterOptions"

const FilterMenu = ({ onFilterChange = () => null }) => {
  const { crystalFilterOptions } = useCrystalFilterOptions()

  const [activeFilters, setActiveFilters] = useState({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isEmpty(crystalFilterOptions) && !loaded) {
      setActiveFilters(crystalFilterOptions)
      setLoaded(true)
    }
  }, [crystalFilterOptions])

  const [mainAnchorEl, setMainAnchorEl] = useState(null)

  const handleOpenFilters = (event) => {
    setMainAnchorEl(event.currentTarget)
  }

  const handleCloseFilters = () => {
    setMainAnchorEl(null)
  }

  const toggleOptionSelected = (options, optionKey) => ({
    ...options,
    [optionKey]: {
      ...options[optionKey],
      selected: !options[optionKey].selected,
    },
  })

  const getAllOptionsToggled = (options) =>
    Object.keys(options).reduce(
      (acc, optionKey) => ({
        ...acc,
        [optionKey]: {
          ...options[optionKey],
          selected: !options[optionKey].selected,
        },
      }),
      {},
    )

  const mapFiltersToExclude = (filters) =>
    Object.keys(filters).reduce((acc, categoryKey) => {
      const options = Object.keys(filters[categoryKey].options).reduce((acc, optionKey) => {
        const option = filters[categoryKey].options[optionKey]
        if (!option.selected) {
          acc.push(option.value)
        }
        return acc
      }, [])

      const newCategoryKey = categoryKey === "color" ? "colorId" : categoryKey
      return { ...acc, [newCategoryKey]: options }
    }, {})

  const handleToggleFilter = (category, option) => {
    const newFilters = {
      ...activeFilters,
      [category]: {
        ...activeFilters[category],
        options:
          option === "all"
            ? getAllOptionsToggled(activeFilters[category].options)
            : toggleOptionSelected(activeFilters[category].options, option),
      },
    }

    const filtersToExclude = mapFiltersToExclude(newFilters)

    setActiveFilters(newFilters)
    onFilterChange(filtersToExclude)
  }

  const optionElems = useMemo(() => {
    return Object.keys(activeFilters).map((categoryKey) => {
      const category = activeFilters[categoryKey]

      return (
        <Box key={category.label} sx={{ padding: "24px" }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "18px",
              color: "white",
              marginBottom: "12px",
              cursor: "pointer",
            }}
            onClick={(event) => {
              event.stopPropagation()
              handleToggleFilter(categoryKey, "all")
            }}
          >
            {category.label}
          </Typography>
          {Object.keys(category.options).map((optionKey) => {
            const option = category.options[optionKey]
            return (
              <MenuItem
                key={option.value}
                onClick={(event) => {
                  event.stopPropagation()
                  handleToggleFilter(categoryKey, optionKey)
                }}
                sx={{ padding: 0 }}
              >
                <Checkbox checked={option.selected} edge="start" sx={{ color: "white" }} />
                <Typography sx={{ fontSize: "14px", color: "white", textTransform: "uppercase" }}>
                  {option.name}
                </Typography>
              </MenuItem>
            )
          })}
        </Box>
      )
    })
  }, [crystalFilterOptions])

  return (
    <Box>
      <IconButton onClick={handleOpenFilters} sx={{ color: "white" }}>
        <FilterListIcon sx={{ fontSize: "32px" }} />
      </IconButton>
      <Menu
        anchorEl={mainAnchorEl}
        open={Boolean(mainAnchorEl)}
        onClose={handleCloseFilters}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        keepMounted
      >
        <Box
          sx={{
            display: "flex",
            background: colors.darkBlue,
            margin: "-8px 0",
            padding: "0 24px",
          }}
        >
          {optionElems}
        </Box>
      </Menu>
    </Box>
  )
}

export default FilterMenu
