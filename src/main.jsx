import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Metropolitan from "./routes/Metropolitan.jsx";
import NotFound from "./routes/NotFound.jsx";
import { loader as loaderRoot } from "./utils/loader.js";
import Hardvar from "./routes/Hardvar.jsx";
import MetDepartments from "./components/MetDepartments.jsx";

export const URL_METROPOLITAN = "https://collectionapi.metmuseum.org/public/collection/v1/";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "metropolitan",
        loader: async () => loaderRoot(`${URL_METROPOLITAN}departments`),
        element: <Metropolitan />,
        children: [
          {path: ":id",
          // loader: async ({params}) => loaderRoot(`${URL_METROPOLITAN}objects?departmentIds=${params.id}`),
          element: <MetDepartments />}
        ],
      },
      { path: "hardvar", element: <Hardvar /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
