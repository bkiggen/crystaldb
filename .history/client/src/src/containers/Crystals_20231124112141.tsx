import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import "./App.css";
import dayjs from "dayjs";

type MessageT = {
  id: number;
  content: string;
  author: string;
  createdAt: string;
};

const App = () => {
  const [crystals, setCrystals] = useState<MessageT[] | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
          query {
            getAllMessages {
              id
              content
              author
            }
          }
        `,
        }),
      });

      const { data } = await response.json();
      setCrystals(data.getAllMessages);
    };

    fetchMessage().catch(console.error);
  }, []);

  return (
    <Box sx={{}}>
      {crystals?.map((crystal) => {
        return (
          <Box
            key={crystal.id}
            sx={{
              border: "1px solid black",
              margin: "10px",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <p>ID: {crystal.id}</p>
              <p>Content: {crystal.content}</p>
            </Box>
            <Box>
              <p>Author: {crystal.author}</p>
              <p>Created At: {dayjs(crystal.createdAt).format("YYYY-MM-DD")}</p>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default App;
