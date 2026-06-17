import { createBrowserRouter } from "react-router-dom"
// import { Board } from "../pages/Borad"
import { Board } from "@/pages/Borad"

const routes = [
  {
    path: '/',
    // element: <Home />,
    element: <div> Home</div>,
  },
  {
    path: '/board',
    element: <Board />,
  },
]

//createBrowserRouter
//createHashRouter
//createMemoryRouter
//createStaticRouter
export const router = createBrowserRouter(routes)
