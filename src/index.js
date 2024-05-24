import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { RouterProvider } from "react-router-dom";
import { rootRouter } from "./frontend/router/root-router";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<RouterProvider router={rootRouter} />);
