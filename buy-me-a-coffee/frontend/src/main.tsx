import React from "react";
import ReactDOM from "react-dom/client";
import { ccc } from "@ckb-ccc/connector-react";
import App from "./App";
import "./index.css";

const defaultClient = new ccc.ClientPublicTestnet();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ccc.Provider defaultClient={defaultClient}>
      <App />
    </ccc.Provider>
  </React.StrictMode>
);
