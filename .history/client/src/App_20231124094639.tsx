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
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<MessageT | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await fetch("http://localhost:4000/graphql", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              getLatestMessage() {
                id
                content
                author
              }
            }
          `,
        }),
      });
      const data = await response.json();
      setMessage(data.data.getLatestMessage);
    };

    fetchMessage().catch(console.error);
  }, []); // Empty dependency array ensures this runs once after the initial render

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {message && (
          <div>
            <p>Message ID: {message.id}</p>
            <p>Content: {message.content}</p>
            <p>Author: {message.author}</p>
          </div>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

export default App;
