import React, { useEffect, useState } from "react"

import { Box, Typography, MenuItem, TextField, InputAdornment, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useTheme } from "@mui/material/styles"
import queryString from "query-string"

import colors from "../../styles/colors"
import { textFieldStyles } from "../../styles/vars"

import useWindowSize from "../../hooks/useWindowSize"
import useDebounce from "../../hooks/useDebounce"

import type { PagingT } from "../../types/Paging"
import { defaultPaging } from "../../types/Paging"
import { useLocation } from "react-router-dom"
import FilterMenu from "../SmartSelect/FilterMenu"

type PaginationT = {
  paging: PagingT
  fetchData: (arg?: Record<string, unknown>) => void
  withoutSearch?: boolean
  onCrystalFilterChange?: (filters: Record<string, string>) => void
  filterOptions?: { label: string; value: string | number }[]
}

const Pagination = ({
  paging = defaultPaging,
  fetchData,
  withoutSearch = false,
  onCrystalFilterChange,
  filterOptions = null,
}: PaginationT) => {
  const theme = useTheme()
  const { width } = useWindowSize()
  const isTablet = width < 768

  const [rawSearch, setRawSearch] = useState(null)
  const searchTerm = useDebounce(rawSearch, 300) // debounced

  const location = useLocation()

  const { sortBy, sortDirection } = queryString.parse(location.search)

  useEffect(() => {
    fetchData({ page: 1, searchTerm, sortBy, sortDirection })
  }, [searchTerm])

  const renderDigit = (num) => {
    if (typeof num !== "number") {
      return num
    }

    return num.toLocaleString()
  }

  const firstPage = 1
  const lastPage = paging.totalPages

  const startBase = paging.currentPage * paging.pageSize - paging.pageSize + 2
  const startItem = startBase - 1

  const adjustedCurrent = paging.currentPage
  const endItem = Math.min(adjustedCurrent * paging.pageSize, paging.totalCount)

  const handleNavClick = (newPage) => {
    fetchData({ page: newPage, searchTerm, sortBy, sortDirection })
  }

  const pagesToRender = () => {
    const pages = []
    const start = Math.max(paging.currentPage - 2, 1)
    const end = Math.min(paging.currentPage + 2, lastPage)

    for (let i = start; i <= end; i++) {
      if (i > paging.currentPage - 3) {
        pages.push(i)
      }
    }

    if (pages[0] !== firstPage) {
      pages.unshift(firstPage, "...")
    }

    if (pages[pages.length - 1] !== lastPage) {
      pages.push("...", lastPage)
    }

    return pages
  }

  return (
    <Box
      sx={{
        background: colors.slateA4,
        marginBottom: "12px",
        minHeight: "56px",
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px",
        borderRadius: "4px",
        border: "1px solid #fff",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {!withoutSearch ? (
          <TextField
            placeholder="Search"
            value={rawSearch}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setRawSearch(event.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon sx={{ color: "white", marginLeft: "-8px" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                height: "42px",
                background: colors.slateGrey,
                color: "white",
                border: "1px solid white",
              },

              borderRadius: "4px",
              marginLeft: isTablet ? "0" : "12px",
              marginTop: isTablet ? "12px" : "0",
              width: isTablet ? "100%" : "240px",
            }}
          />
        ) : null}
        {onCrystalFilterChange ? <FilterMenu onFilterChange={onCrystalFilterChange} /> : null}
        {filterOptions ? (
          <TextField
            select
            id="filter"
            placeholder="Filter"
            defaultValue="All"
            onChange={(event) =>
              fetchData({
                subscriptionId: event.target.value === "All" ? null : event.target.value,
                searchTerm,
                sortBy,
                sortDirection,
              })
            }
            sx={{ ...textFieldStyles, minWidth: "200px" }}
          >
            <MenuItem key="All" value="All">
              All
            </MenuItem>
            {filterOptions.map((option) => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: isTablet ? "12px" : "0",
        }}
      >
        {paging.totalPages > 1 && (
          <>
            {!isTablet && (
              <Typography sx={{ marginRight: "12px", color: colors.slateGrey }}>
                Showing {startItem.toLocaleString()} - {endItem.toLocaleString()} of{" "}
                {paging.totalCount.toLocaleString()}
              </Typography>
            )}
            <Box sx={{ display: "flex", marginRight: "-2px", marginLeft: "2px" }}>
              {pagesToRender().map((page, i) => {
                if (page === "...") {
                  return (
                    <Typography
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "32px",
                        padding: "0 0px",
                        color: theme.palette.primary.main,
                        fontSize: "14px",
                        fontWeight: "500",
                        marginRight: "4px",
                        minWidth: "18px",
                      }}
                    >
                      {page}
                    </Typography>
                  )
                }
                return (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: page === paging.currentPage ? theme.palette.primary.main : "none",
                      border: `1px solid ${theme.palette.primary.main}`,
                      color: page === paging.currentPage ? "white" : theme.palette.primary.main,
                      borderRadius: "8px",
                      height: "32px",
                      padding: "0 6px",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginRight: "6px",
                      cursor: page === paging.currentPage ? "not-allowed" : "pointer",
                      minWidth: "32px",

                      "&:hover": {
                        background:
                          page === paging.currentPage
                            ? theme.palette.primary.dark
                            : theme.palette.primary.main,
                        color: "white",
                      },
                    }}
                    onClick={() => handleNavClick(page)}
                  >
                    {renderDigit(page)}
                  </Box>
                )
              })}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export default Pagination
