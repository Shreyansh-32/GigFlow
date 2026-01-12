/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socketInstance = io(
        import.meta.env.VITE_BACKEND_URL.replace("/api", ""),
        {
          query: {
            userId: user._id,
          },
        }
      );

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      socketInstance.on("connect", () => {
        console.log("✅ Socket Connected! ID:", socketInstance.id);
      });

      socketInstance.on("connect_error", (err) => {
        console.error("❌ Socket Connection Error:", err);
      });

      socketInstance.on("notification", (data) => {

        toast(data.message, {
          icon: "🎉",
          duration: 5000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      });

      return () => {
        socketInstance.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
