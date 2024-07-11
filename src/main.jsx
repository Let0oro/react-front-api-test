import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Metropolitan from "./routes/Metropolitan.jsx";
import NotFound from "./routes/NotFound.jsx";
import { loader as loaderRoot } from "./utils/loader.js";
import Chicago from "./routes/Chicago.jsx";
import Hardvar from "./routes/Hardvar.jsx";

const URL_METROPOLITAN = "https://collectionapi.metmuseum.org/public/collection/v1/";
const URL_CHICAGO = "https://api.artic.edu/api/v1/artworks";
const URL_HARDVAR = "https://api.harvardartmuseums.org";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "metropolitan",
        loader: async () => loaderRoot(`${URL_MUSEUM}departments`),
        element: <Metropolitan />,
      },
      { path: "chicago", loader: async () => loaderRoot(URL_CHICAGO), element: <Chicago /> },
      { path: "hardvar", loader: async () => loaderRoot(URL_HARDVAR), element: <Hardvar /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
