import React from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container); // createRoot로 React 애플리케이션 초기화
  root.render(<App />);
} else {
  console.error("Root container not found");
}
