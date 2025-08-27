import { useMemo, useState, useEffect } from "react"
import { Box, Typography, Menu, MenuItem, IconButton, Checkbox, TextField } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import { isEmpty, isEqual } from "lodash"
import colors from "../../styles/colors"
import useCrystalFilterOptions from "../../hooks/useCrystalFilterOptions"
import { CloseOutlined, PlayCircle } from "@mui/icons-material"

type FilterMenuProps = {
  activeFilters: any
  setActiveFilters: any
  defaultFilteredOut: any
  fetchCrystals: any
  lookbackLimit?: any
  setLookbacklimit?: any
}

const FilterMenu = ({
  activeFilters,
  setActiveFilters,
  defaultFilteredOut,
  fetchCrystals,
  lookbackLimit,
  setLookbacklimit,
}: FilterMenuProps) => {
  const { crystalFilterOptions } = useCrystalFilterOptions({ defaultFilteredOut })

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isEmpty(crystalFilterOptions) && !loaded) {
      setActiveFilters(crystalFilterOptions)
      setLoaded(true)
    }
  }, [crystalFilterOptions])

  const handleClearFilters = () => {
    setActiveFilters(crystalFilterOptions)
  }

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

    setActiveFilters(newFilters)
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

  const anyFiltersSelected = !isEqual(activeFilters, crystalFilterOptions)

  return loaded ? (
    <Box>
      <IconButton onClick={handleClearFilters} sx={{ color: "white", marginRight: "12px" }}>
        <CloseOutlined sx={{ fontSize: "24px" }} />
      </IconButton>
      <IconButton onClick={fetchCrystals} sx={{ color: "white", marginRight: "12px" }}>
        <PlayCircle sx={{ fontSize: "24px" }} />
      </IconButton>
      <IconButton
        onClick={handleOpenFilters}
        sx={{ color: anyFiltersSelected ? colors.yellow : "white" }}
      >
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
            flexDirection: "column",
            background: colors.darkBlue,
            margin: "-8px 0",
            padding: "24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
            }}
          >
            {optionElems}
          </Box>
          {setLookbacklimit && (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "18px",
                  color: "white",
                  marginBottom: "12px",
                }}
              >
                Lookback Limit (Cycles)
              </Typography>
              <TextField
                type="number"
                defaultValue={lookbackLimit}
                onBlur={(e) => setLookbacklimit(e.target.value)}
                inputProps={{
                  min: 1,
                  step: 1,
                }}
                sx={{
                  width: "100px",
                  "& .MuiInputBase-input": {
                    color: "white",
                    fontSize: "14px",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: colors.yellow,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.yellow,
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Menu>
    </Box>
  ) : (
    <Box sx={{ height: "48px" }} />
  )
}

export default FilterMenu
