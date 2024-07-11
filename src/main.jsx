import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Metropolitan from "./routes/Metropolitan.jsx";
import NotFound from "./routes/NotFound.jsx";
import { loader as loaderRoot } from "./utils/loader.js";
import Genshin from "./routes/Genshin.jsx";
import GenshinApi from "./components/Genshin/GenshinApi.jsx";
import GenshinApiChildren from "./components/Genshin/GenshinApiChildren.jsx";
import NLU from "./routes/NLU.jsx";

export const URL_GENSHIN = "https://genshin.jmp.blue/";
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
      // {
      //   path: "genshin",
      //   loader: async () => loaderRoot(URL_GENSHIN),
      //   element: <Genshin />,
      //   children: [
      //     {
      //       path: ":class",
      //       element: <GenshinApi />,
      //       loader: async ({ params }) =>
      //         loaderRoot(`${URL_GENSHIN}${params.class}`),
      //       children: [
      //         {
      //           path: ":title",
      //           element: <GenshinApiChildren />,
      //           loader: async ({ params }) =>
      //             loaderRoot(`${URL_GENSHIN}${params.class}/${params.title}`),
      //         },
      //       ],
      //     },
      //   ],
      // },
      { path: "natural-language", loader: async () => loaderRoot(URL_LANGUAGE), element: <NLU /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
