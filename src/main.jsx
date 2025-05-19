import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GlobalStyled from "./styled/global";
import { RouterProvider } from "react-router-dom";
import { route } from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <GlobalStyled />
      <RouterProvider router={route} />
    </>
  </StrictMode>
);
