import React, { useState, useEffect } from "react";
import "./App.css";

type MessageT = {
  id: number;
  content: string;
  author: string;
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
    <>
      {messages?.map((message) => {
        return (
          <div key={message.id}>
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
