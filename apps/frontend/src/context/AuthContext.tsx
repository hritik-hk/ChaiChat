import { createContext, useState, ReactNode, Dispatch } from "react";

interface authUserType {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextInterface {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<React.SetStateAction<boolean>>;
  authUser: authUserType | null;
  setAuthUser: Dispatch<React.SetStateAction<authUserType | null>>;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthContextProvider = ({ children }: { children?: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState<authUserType | null>(null);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
