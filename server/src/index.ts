import express from "express";
import "dotenv/config";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { initSocket } from "./socket";
import authRoutes from "./routes/authRoutes";
import gigRoutes from "./routes/gigRoutes";
import bidRoutes from "./routes/bidRoutes";
import hiringRoutes from "./routes/hiringRoutes";

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
    "http://localhost:5173",
    "https://gig-flow-ruby.vercel.app" 
  ],
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/hiring", hiringRoutes);


app.get("/", (req, res) => {
  res.send("Hello from server");
});


const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});