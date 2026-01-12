"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const db_1 = __importDefault(require("./config/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_1 = require("./socket");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const gigRoutes_1 = __importDefault(require("./routes/gigRoutes"));
const bidRoutes_1 = __importDefault(require("./routes/bidRoutes"));
const hiringRoutes_1 = __importDefault(require("./routes/hiringRoutes"));
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/gigs", gigRoutes_1.default);
app.use("/api/bids", bidRoutes_1.default);
app.use("/api/hiring", hiringRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello from server");
});
const httpServer = (0, http_1.createServer)(app);
(0, socket_1.initSocket)(httpServer);
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
