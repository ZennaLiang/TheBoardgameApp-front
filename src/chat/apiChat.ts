import io, { Socket } from "socket.io-client";
import { logger } from "../utils/logger";

const baseUrl = `${import.meta.env.VITE_API_URL}/chat`;

let ws: Socket | null = null;

const getSocket = (): Socket => {
  if (!ws) {
    ws = io(import.meta.env.VITE_CHAT_URL as string);
  }
  return ws;
};

export const apiDisconnectSocket = (): void => {
  if (ws) {
    ws.disconnect();
    ws = null;
  }
};

export const apiInitSocket = (token: string): Promise<Socket> => {
  return new Promise((resolve) => {
    const socket = getSocket();
    socket.on("connect", () => {
      logger.info("apiInitSocket", "SOCKET OPEN");
      socket.emit("auth", { token });
      resolve(socket);
    });
  });
};

export const apiGetChats = async (token: string) => {
  const resp = await fetch(`${baseUrl}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (resp.status !== 200) throw resp.status;
  const chats = await resp.json();
  const socket = getSocket();
  chats.forEach((chat: any) => {
    socket.emit("join", { chatId: chat._id });
  });
  return chats;
};

export const apiCreateChat = async (who: string, token: string) => {
  return fetch(`${baseUrl}/start`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ who })
  }).then(response => {
    if (response.status !== 200) throw response.status;
    return response.json();
  });
};

export const apiGetChat = async (token: string, id: string) => {
  const socket = getSocket();
  socket.emit("join", { chatId: id });

  const resp = await fetch(`${baseUrl}/get/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (resp.status !== 200) throw resp.status;
  return resp.json();
};

export const apiSendChat = async (chatId: string, message: string, _token: string) => {
  const socket = getSocket();
  socket.emit("chat", { _id: chatId, message });
};

export const apiSearchUser = async (token: string, name: string) => {
  return fetch(`${baseUrl}/search_user`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  }).then(response => {
    if (response.status !== 200) throw response.status;
    return response.json();
  });
};
