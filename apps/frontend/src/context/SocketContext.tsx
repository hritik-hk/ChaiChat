import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";

type SocketProviderProps = {
  children?: ReactNode;
};

interface SocketContextInterface {
  sendMessage: (msg: string) => void;
}

export const SocketContext = createContext<SocketContextInterface | null>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const sendMessage: SocketContextInterface["sendMessage"] = useCallback(
    (msg: string) => {
      console.log("send message", msg);
      if (socket) {
        socket.emit("message", msg);
      }
    },
    [socket]
  );

  useEffect(() => {
    const socket = io("http://localhost:8080");
    setSocket(socket);

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
