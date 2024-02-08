import React, { useEffect, useState } from "react"

import { Box, Typography, TextField, InputAdornment, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useTheme } from "@mui/material/styles"

import colors from "../../styles/colors"

import useWindowSize from "../../hooks/useWindowSize"
import useDebounce from "../../hooks/useDebounce"

import type { PagingT } from "../../types/Paging"
import { defaultPaging } from "../../types/Paging"

type PaginationT = {
  paging: PagingT
  fetchData: (arg?: Record<string, unknown>) => void
}

const Pagination = ({ paging = defaultPaging, fetchData }: PaginationT) => {
  const theme = useTheme()
  const { width } = useWindowSize()
  const isTablet = width < 768

  const [rawSearch, setRawSearch] = useState(null)
  const debouncedSearch = useDebounce(rawSearch, 1000)

  useEffect(() => {
    // search something
  }, [debouncedSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderDigit = (num) => {
    if (typeof num !== "number") {
      return num
    }

    return num.toLocaleString()
  }

  const firstPage = 1
  const lastPage = paging.totalPages

  const startBase = paging.currentPage * paging.pageSize
  const startItem = startBase - 1

  const adjustedCurrent = paging.currentPage
  const endItem = Math.min(adjustedCurrent * paging.pageSize, paging.totalCount)

  const handleNavClick = (newPage) => {
    fetchData({ page: newPage })
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
        background: colors.slate,
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
      <TextField
        placeholder="Filter"
        value={rawSearch}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRawSearch(event.target.value)}
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
              <Typography sx={{ marginRight: "12px", color: "rgb(157, 157, 157)" }}>
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
                      border:
                        page === paging.currentPage
                          ? "none"
                          : `1px solid ${theme.palette.primary.main}`,
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
