import { createBrowserRouter } from "react-router-dom"

const routes = [
  {
    path: '/',
    // element: <Home />,
    element: <div> Home</div>,
  },
  {
    path: '/board',
    element: <div> Board</div>,
  },
]

//createBrowserRouter
//createHashRouter
//createMemoryRouter
//createStaticRouter
export const router = createBrowserRouter(routes)
