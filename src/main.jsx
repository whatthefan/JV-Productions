import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Otras versiones disponibles:
// import App from "./JVSlides.jsx";   // 4 slides con scroll-snap
// import App from "./JVLanding.jsx";  // landing larga clásica

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
