import React, { useState, useEffect } from "react"
import { Box, Container } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"

import { monthOptions } from "../../lib/constants"

import { getAllShipments } from "../../api/shipments"
import { getAllSubscriptions } from "../../api/subscriptions"

import type { ShipmentT } from "../../types/Shipment"
import type { CrystalT } from "../../types/Crystal"
import type { SubscriptionT } from "../../types/Subscription"

import type { PagingT } from "../../types/Paging"
import { defaultPaging } from "../../types/Paging"
import Pagination from "../../components/Pagination"
import NewShipment from "./NewShipment"
import UpdateShipmentModal from "../Shipments/UpdateShipmentModal"
import ColorIndicator from "../../components/ColorIndicator"

const Shipments = () => {
  const [shipments, setShipments] = useState<ShipmentT[] | null>(null)
  const [paging, setPaging] = useState<PagingT>(defaultPaging)
  const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionT[]>([])
  const [selectedShipment, setSelectedShipment] = useState<ShipmentT>(null)

  const fetchShipments = async (args) => {
    const response = await getAllShipments(args)
    setShipments(response.data)
    setPaging(response.paging)
  }

  const fetchSubscriptionTypes = async () => {
    const response = await getAllSubscriptions()
    setAllSubscriptions(response || [])
  }

  useEffect(() => {
    fetchShipments({})
    fetchSubscriptionTypes()
  }, [])

  const addShipment = (newShipment: ShipmentT) => {
    setShipments((prevShipments) => {
      if (prevShipments) {
        return [...prevShipments, newShipment]
      }
      return null
    })
  }

  const columns: GridColDef[] = [
    {
      field: "month",
      headerName: "Month",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return <div>{monthOptions[params.row.month]?.short}</div>
      },
    },
    {
      field: "year",
      headerName: "Year",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.year}</div>
      },
    },
    {
      field: "subscriptionType",
      headerName: "Subscription Type",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.subscription?.shortName}</div>
      },
    },
    {
      field: "cycle",
      headerName: "Cycle",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <div>
            {params.row.cycle || `${params.row.cycleRangeStart} - ${params.row.cycleRangeEnd}`}
          </div>
        )
      },
    },
    {
      field: "crystals",
      headerName: "Crystals",
      flex: 3,
      renderCell: (params: GridCellParams) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "4px",
              minWidth: "300px",
              flexWrap: "wrap",
            }}
          >
            {params.row.crystals?.map((crystal: CrystalT, idx) => (
              <Box
                key={crystal.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ColorIndicator indicatorValue={crystal.color?.hex} />
                <Box sx={{ marginRight: "6px" }}>
                  {crystal.name}
                  {idx !== params.row.crystals.length - 1 ? "," : ""}
                </Box>
              </Box>
            ))}
          </Box>
        )
      },
    },
  ]

  return (
    <Container sx={{ paddingBottom: "240px", width: "90%", margin: "0 auto" }}>
      <NewShipment addShipment={addShipment} allSubscriptions={allSubscriptions} />
      {selectedShipment ? (
        <UpdateShipmentModal
          shipment={selectedShipment}
          setSelectedShipment={setSelectedShipment}
          fetchShipments={fetchShipments}
        />
      ) : null}
      <Pagination
        fetchData={fetchShipments}
        paging={paging}
        filterOptions={allSubscriptions.map((s) => {
          return {
            label: s.shortName,
            value: s.id,
          }
        })}
        withoutSearch
      />
      <DataGrid
        sx={{
          background: "rgba(70, 90, 126, 0.4)",
          color: "white",
        }}
        rowHeight={120}
        rows={shipments || []}
        onRowClick={(params) => {
          setSelectedShipment(params.row as ShipmentT)
        }}
        columns={columns}
        disableColumnMenu
        disableColumnFilter
        hideFooter
        hideFooterPagination
        checkboxSelection={false}
        className="bg-white p-0"
        autoHeight
      />
    </Container>
  )
}

export default Shipments
