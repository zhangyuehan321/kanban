import { createBrowserRouter } from 'react-router-dom';
// import { Board } from "../pages/Borad"
import { BoardPage } from '@/pages/Borad';

const routes = [
    {
        path: '/',
        // element: <Home />,
        element: <div> Home</div>
    },
    {
        path: '/board',
        element: <BoardPage />
    }
];

//createBrowserRouter
//createHashRouter
//createMemoryRouter
//createStaticRouter
export const router = createBrowserRouter(routes, {
    basename: import.meta.env.BASE_URL.replace(/\/$/, '') || undefined
});
