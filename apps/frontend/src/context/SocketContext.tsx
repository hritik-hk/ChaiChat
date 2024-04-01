import { ReactNode, createContext, useCallback, useEffect } from "react";
import { io } from "socket.io-client";

type SocketProviderProps = {
  children?: ReactNode;
};

interface SocketContextInterface {
  sendMessage: (msg: string) => void;
}

export const SocketContext = createContext<SocketContextInterface | null>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const sendMessage: SocketContextInterface["sendMessage"] = useCallback(
    (msg: string) => {
      console.log("send message", msg);
    },
    []
  );

  useEffect(() => {
    const socket = io("http://localhost:8080");

    return () => {
      socket.disconnect();
    };
  },[]);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
