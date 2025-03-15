import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Make sure App.js exists and is correctly named
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // Optional: Ensure your global styles are imported

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>

        <App />

    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}