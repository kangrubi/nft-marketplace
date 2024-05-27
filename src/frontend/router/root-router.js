import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import App from "../components/App";
import Create from "../components/Create";

export const rootRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/Create",
        element: <Create />,
      },
    ],
  },
]);
