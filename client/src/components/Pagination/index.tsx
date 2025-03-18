import React, { useEffect, useState } from "react"

import { Box, Typography, TextField, InputAdornment, Menu, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FilterAltIcon from "@mui/icons-material/FilterAlt"
import SearchIcon from "@mui/icons-material/Search"
import { useTheme } from "@mui/material/styles"
import queryString from "query-string"

import colors from "../../styles/colors"

import useWindowSize from "../../hooks/useWindowSize"
import useDebounce from "../../hooks/useDebounce"

import type { PagingT } from "../../types/Paging"
import { defaultPaging } from "../../types/Paging"
import { useLocation } from "react-router-dom"
import SubscriptionFilter from "./SubscriptionFilter"
import MonthFilter from "./MonthFilter"
import YearFilter from "./YearFilter"
import CycleFilter from "./CycleFilter"

type PaginationT = {
  paging: PagingT
  fetchData: (arg?: Record<string, unknown>) => void
  withoutSearch?: boolean
  filterContent?: React.ReactNode
  onDataChange?: (arg: Record<string, unknown>) => void
  withSubscriptionFilter?: boolean
}

const Pagination = ({
  paging = defaultPaging,
  fetchData,
  withoutSearch = false,
  filterContent,
  onDataChange = () => null,
  withSubscriptionFilter,
}: PaginationT) => {
  const theme = useTheme()
  const { width } = useWindowSize()
  const isTablet = width < 768

  const location = useLocation()

  const {
    sortBy,
    sortDirection,
    searchTerm: defaultSearchTerm,
  } = queryString.parse(location.search)

  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedCycle, setSelectedCycle] = useState(null)
  const [rawSearch, setRawSearch] = useState(defaultSearchTerm || "")
  const debouncedCycle = useDebounce(selectedCycle, 600) // debounced
  const searchTerm = useDebounce(rawSearch, 600) // debounced

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

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

  const handleUpdate = (newPage = 1, searchTermArg = rawSearch) => {
    const newData = {
      page: newPage,
      searchTerm: searchTermArg,
      sortBy,
      sortDirection,
      ...(selectedMonth ? { month: selectedMonth } : {}),
      ...(selectedYear ? { year: selectedYear } : {}),
      ...(selectedCycle ? { cycle: selectedCycle } : {}),
      ...(selectedSubscriptionId !== "All" ? { subscriptionId: selectedSubscriptionId } : {}),
    }
    // do we need both of these?
    onDataChange(newData)
    fetchData(newData)
  }

  const handleNavClick = (newPage) => {
    handleUpdate(newPage, searchTerm)
  }

  useEffect(() => {
    handleUpdate()
  }, [searchTerm, selectedSubscriptionId, selectedMonth, selectedYear, debouncedCycle])

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
        padding: "6px 16px",
        borderRadius: "4px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
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
        {filterContent}
        {withSubscriptionFilter && (
          <>
            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleMenuOpen}
            >
              <FilterAltIcon sx={{ color: "white" }} />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <Box sx={{ padding: "12px", display: "flex", gap: "12px" }}>
                <SubscriptionFilter
                  selectedSubscriptionId={selectedSubscriptionId}
                  setSelectedSubscriptionId={setSelectedSubscriptionId}
                />
                <MonthFilter selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
                <YearFilter selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
                <CycleFilter selectedCycle={selectedCycle} setSelectedCycle={setSelectedCycle} />
                <IconButton
                  onClick={() => {
                    setSelectedMonth(null)
                    setSelectedYear(null)
                    setSelectedCycle(null)
                    setSelectedSubscriptionId(null)
                  }}
                  sx={{ height: "56px", width: "56px" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Menu>
          </>
        )}
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
              <Typography
                sx={{
                  marginRight: "12px",
                  marginLeft: "12px",
                  color: colors.slateGrey,
                  whiteSpace: "nowrap",
                }}
              >
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
