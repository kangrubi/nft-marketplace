import React from "react";
import Home from "../components/Home";
import App from "../components/App";
import { createBrowserRouter } from "react-router-dom";

export const rootRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
]);
