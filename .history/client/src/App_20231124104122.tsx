import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

type MessageT = {
  id: number;
  content: string;
  author: string;
};

const App = () => {
  const [messages, setMessages] = useState<MessageT[] | null>(null);
  console.log("🚀 ~ file: App.tsx:14 ~ App ~ messages:", messages);

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
      console.log("🚀 ~ file: App.tsx:38 ~ fetchMessage ~ data:", data);
      setMessages(data.getAllMessages);
    };

    fetchMessage().catch(console.error);
  }, []);

  return (
    <>
      {messages?.map((message) => {
        return (
          <div>
            <p>Message ID: {message.id}</p>
            <p>Content: {message.content}</p>
            <p>Author: {message.author}</p>
          </div>
        );
      })}
    </>
  );
};

export default App;
