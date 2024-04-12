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
  sendDM: (msg: string) => void;
  messages: string[];
  socket: Socket | null;
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

  const sendDM: SocketContextInterface["sendMessage"] = useCallback(
    (msg: string) => {
      if (socket) {
        const privateRoomId = localStorage.getItem("privateRoomId");
        console.log(msg);
        socket.emit("private-message", privateRoomId, msg);
      }
    },
    [socket]
  );

  const onMessageReceive = useCallback(async (msg: string) => {
    //const message = await JSON.parse(msg);
    setMessages((prev) => [...prev, msg]);
  }, []);

  // const onDMReceive = useCallback(async (msg: string) => {
  //   const message = await JSON.parse(msg);
  //   setMessages((prev) => [...prev, message.msg]);
  // }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URI, {
      withCredentials: true,
    });
    setSocket(socket);
    socket.on("private-message", onMessageReceive);

    socket.on("private-chat", (chatId: string) => {
      socket.emit("private-chat", chatId);
      localStorage.setItem("privateRoomId", chatId);
    });

    return () => {
      socket.disconnect();
      socket.off("private-message", onMessageReceive);
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    const privateRoomId = localStorage.getItem("privateRoomId");

    if (privateRoomId) {
      if (socket) {
        socket.emit("private-chat", privateRoomId);
      }
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, socket, sendDM }}>
      {children}
    </SocketContext.Provider>
  );
};
