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
  const [messages, setMessages] = useState<MessageT[] | null>(null);

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
      setMessages(data.getAllMessages);
    };

    fetchMessage().catch(console.error);
  }, []);

  return (
    <Box sx={{}}>
      {messages?.map((message) => {
        return (
          <Box
            key={message.id}
            sx={{
              border: "1px solid black",
              p: 1,
              display: "flex",
              width: "100%",
            }}
          >
            <Box>
              <p>Message ID: {message.id}</p>
              <p>Content: {message.content}</p>
            </Box>
            <Box>
              <p>Author: {message.author}</p>
              <p>Created At: {dayjs(message.createdAt).format("YYYY-MM-DD")}</p>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default App;
