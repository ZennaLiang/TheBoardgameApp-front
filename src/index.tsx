import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./css/index.scss";

const container = document.getElementById("root")!;
createRoot(container).render(<App />);
