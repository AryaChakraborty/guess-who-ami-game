"use client";

import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 5000,
    });
  }
  return socket;
}

/** Returns a promise that resolves once the socket is connected (or rejects on timeout). */
export function ensureConnected(timeoutMs = 5000): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s = getSocket();
    if (s.connected) {
      resolve(s);
      return;
    }

    const timer = setTimeout(() => {
      reject(
        new Error(
          "Could not connect to game server. Make sure the server is running on port 3001."
        )
      );
    }, timeoutMs);

    s.once("connect", () => {
      clearTimeout(timer);
      resolve(s);
    });

    s.once("connect_error", (err) => {
      clearTimeout(timer);
      reject(
        new Error(
          `Could not connect to game server: ${err.message}. Make sure the server is running.`
        )
      );
    });

    // Make sure we're trying to connect
    if (s.disconnected) {
      s.connect();
    }
  });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
