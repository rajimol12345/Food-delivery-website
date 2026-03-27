import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL || "https://food-delivery-website-k1e1.onrender.com";

export const socket = io(SOCKET_URL, {
    autoConnect: true,
});
