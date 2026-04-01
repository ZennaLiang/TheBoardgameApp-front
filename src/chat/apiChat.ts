import io, { Socket } from "socket.io-client";

let baseUrl = `${import.meta.env.VITE_API_URL}/chat`;
let ws = io(import.meta.env.VITE_CHAT_URL as string);

export const apiInitSocket = (token: string): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    ws.on("connect", () => {
      console.log("\n SOCKET OPEN \n\n");
      ws.emit("auth", {
        token
      });
      resolve(ws);
    });
  });
};

export const apiGetChats = async (token: string) => {
  let resp = await fetch(`${baseUrl}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (resp.status !== 200) {
    throw resp.status;
  }
  let chats = await resp.json();

  chats.forEach((chat: any) => {
    ws.emit("join", {
      chatId: chat._id
    });
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
    if (response.status !== 200) {
      throw response.status;
    }
    return response.json();
  });
};

export const apiGetChat = async (token: string, id: string) => {
  ws.emit("join", {
    chatId: id
  });

  let resp = await fetch(`${baseUrl}/get/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (resp.status !== 200) {
    throw resp.status;
  }

  let data = await resp.json();

  return data;
};

export const apiSendChat = async (chatId: string, message: string, token: string) => {
  ws.emit("chat", {
    _id: chatId,
    message
  });
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
    if (response.status !== 200) {
      throw response.status;
    }
    return response.json();
  });
};
