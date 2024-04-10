import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { useEffect } from "react";
import { useAuth } from "./hooks/auth";
import Protected from "./components/Protected";

const router = createBrowserRouter([
  {
    path: "/chat",

    element: (
      <Protected>
        <Chat />,
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  const { isLoggedIn, setIsLoggedIn, setAuthUser } = useAuth();

  useEffect(() => {
    fetch("http://localhost:8080/api/auth/check", {
      credentials: "include" as RequestCredentials,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`some went wrong error code: ${response.status}`);
        }
      })
      .then((respData) => {
        if (respData.token) {
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [setIsLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:8080/api/user/own", {
        credentials: "include" as RequestCredentials,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`some went wrong error code: ${response.status}`);
          }
        })
        .then((respData) => {
          setAuthUser(respData);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [isLoggedIn, setAuthUser]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
