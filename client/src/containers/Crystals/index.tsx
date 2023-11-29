import React, { useState, useEffect } from "react";

import { Box } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";

import { getAllCrystals } from "../../graphql/crystals";
import type { CrystalT } from "../../types/Crystal";

import NewCrystal from "./NewCrystal";

const Crystals = () => {
  const [crystals, setCrystals] = useState<CrystalT[] | null>(null);

  useEffect(() => {
    const fetchCrystals = async () => {
      const response = await getAllCrystals();
      setCrystals(response);
    };
    fetchCrystals();
  }, []);

  const addCrystal = (newCrystal: CrystalT) => {
    setCrystals((prevCrystals) => {
      if (prevCrystals) {
        return [...prevCrystals, newCrystal];
      }
      return null;
    });
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.id}</div>;
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 300,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.name}</div>;
      },
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.category}</div>;
      },
    },
    {
      field: "rarity",
      headerName: "Rarity",
      width: 100,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.rarity}</div>;
      },
    },
    {
      field: "findAge",
      headerName: "Find Age",
      width: 100,
      renderCell: (params: GridCellParams) => {
        return <div>{params.row.findAge}</div>;
      },
    },
    {
      field: "color",
      headerName: "Color",
      width: 200,
      renderCell: (params: GridCellParams) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: params.row.color?.hex,
                marginRight: "8px",
              }}
            />
            {params.row.color?.name}
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 300,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        return (
          <div>{dayjs(params.row.createdAt).format("dddd, MMMM D YYYY")}</div>
        );
      },
    },
  ];

  return (
    <Box sx={{ paddingTop: "80px", paddingBottom: "120px" }}>
      <NewCrystal addCrystal={addCrystal} />
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          sx={{
            background: "rgba(70, 90, 126, 0.4)",
            color: "white",
            maxWidth: "1200px",
            width: "90%",
            margin: "0 auto",
          }}
          rows={crystals || []}
          columns={columns}
          disableColumnMenu
          disableColumnFilter
          hideFooter
          hideFooterPagination
          checkboxSelection={false}
          className="bg-white p-0"
          autoHeight
        />
      </div>
    </Box>
  );
};

export default Crystals;
