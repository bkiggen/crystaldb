import { useMemo, useState, useEffect } from "react"
import { Box, Typography, Menu, MenuItem, IconButton, Checkbox } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"

import colors from "../../styles/colors"

import useCrystalFilterOptions from "../../hooks/useCrystalFilterOptions"

const FilterMenu = ({ onFilterChange }) => {
  const { crystalFilterOptions } = useCrystalFilterOptions()
  const [activeFilters, setActiveFilters] = useState({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (Object.keys(crystalFilterOptions.colorOptions.options).length > 0 && !loaded) {
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

  const handleToggleFilter = (category, option) => {
    const newFilters = {
      ...activeFilters,
      [category]: {
        ...activeFilters[category],
        options: {
          ...activeFilters[category].options,
          [option]: {
            ...activeFilters[category].options[option],
            value: !activeFilters[category].options[option].value,
          },
        },
      },
    }

    const filtersToExclude = Object.keys(newFilters).reduce((acc, categoryKey) => {
      const category = newFilters[categoryKey]
      const options = Object.keys(category.options).reduce((acc, optionKey) => {
        const option = category.options[optionKey]
        if (!option.value) {
          acc.push(optionKey)
        }
        return acc
      }, [])
      const newCategoryKey = categoryKey.replace("Options", "")
      return { ...acc, [newCategoryKey]: options }
    }, {})

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
            }}
          >
            {category.label}
          </Typography>
          {Object.keys(category.options).map((optionKey) => {
            const option = category.options[optionKey]
            return (
              <MenuItem
                key={option.name}
                onClick={(event) => {
                  event.stopPropagation()
                  handleToggleFilter(categoryKey, optionKey)
                }}
                sx={{ padding: 0 }}
              >
                <Checkbox checked={option.value} edge="start" sx={{ color: "white" }} />
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
          }}
        >
          {optionElems}
        </Box>
      </Menu>
    </Box>
  )
}

export default FilterMenu
