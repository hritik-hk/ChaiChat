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
  messages: string[];
}

export const SocketContext = createContext<SocketContextInterface | null>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: SocketContextInterface["sendMessage"] = useCallback(
    (msg: string) => {
      console.log("send message", msg);
      if (socket) {
        socket.emit("message", msg);
      }
    },
    [socket]
  );

  const onMessageReceive = useCallback(async (msg: string) => {
    const message = await JSON.parse(msg);
    setMessages((prev) => [...prev, message.msg]);
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8080", {
      withCredentials: true,
    });
    setSocket(socket);
    socket.on("message", onMessageReceive);

    return () => {
      socket.disconnect();
      socket.off("message", onMessageReceive);
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
