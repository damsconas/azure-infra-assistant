
import type { RouteObject } from 'react-router-dom';
import AzureChat from '../pages/azure-chat/page';
import NotFound from '../pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AzureChat />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
