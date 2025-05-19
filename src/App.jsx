import { createBrowserRouter } from "react-router-dom";

// pages
import { Main } from "./pages/Main";
import { Repositorio } from "./pages/Repositorio";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },

  {
    path: "/repositorio/:repositorio",
    element: <Repositorio />,
  },
]);

export { route };
