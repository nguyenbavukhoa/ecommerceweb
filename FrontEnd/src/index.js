import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import "antd/dist/reset.css";
import "./css/main.css";
import "./css/home-responsive.css";
import "./css/toast-message.css";
import "./font/font-awesome-pro-v6-6.2.0/css/all.min.css";
import productsData from "../src/JSON/products.json";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
