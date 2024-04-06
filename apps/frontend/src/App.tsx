import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login";
import Chat from "./pages/Chat";

const router = createBrowserRouter([
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
