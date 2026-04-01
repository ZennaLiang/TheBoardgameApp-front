import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { Socket } from "socket.io-client";

import {
  apiInitSocket,
  apiCreateChat,
  apiGetChat,
  apiGetChats,
  apiSendChat,
  apiSearchUser
} from "./apiChat";
import { formatDistanceToNow } from "date-fns";

import DefaultProfileImg from "../images/avatar.png";

import "../css/chat.scss";

interface ChatUser {
  _id: string;
  name: string;
}

interface ChatMessage {
  _id: string;
  from: string | ChatUser;
  message: string;
  timestamp: string;
}

interface ChatData {
  _id: string;
  between: ChatUser[];
  messages: ChatMessage[];
}

interface ToastMessage {
  type: string;
  message: string;
}

interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatSelected, setChatSelected] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatData>({} as ChatData);
  const [user, setUser] = useState(isAuthenticated().user);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [newMessage, setNewMessage] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<ChatUser[]>([]);
  const [toastMsg, setToastMsg] = useState<ToastMessage | null>(null);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const wsRef = useRef<Socket | null>(null);

  const toast = useCallback((message: string, type: string = "danger") => {
    setToastMsg({ type, message });

    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  }, []);

  useEffect(() => {
    try {
      const mutedFromStorage = localStorage.getItem("muted") === "true";
      setMuted(mutedFromStorage);
    } catch (error) {
      console.log(error);
    }

    const initializeSocket = async () => {
      try {
        const ws = await apiInitSocket(isAuthenticated().token);
        wsRef.current = ws;
        
        await getChats();

        intervalRef.current = setInterval(() => {
          getChats(true);
        }, parseInt(import.meta.env.VITE_CHAT_REFRESH || "60000"));

        ws.on("newMsg", (data: any) => {
          setMuted(currentMuted => {
            if (!currentMuted && data.from !== isAuthenticated().user._id) {
              const audioElement = document.getElementById("msgDing") as HTMLAudioElement;
              audioElement?.play();
            }
            return currentMuted;
          });

          setChatSelected(currentChatSelected => {
            if (currentChatSelected) {
              setSelectedChat(prevChat => {
                if (data._id === prevChat._id) {
                  setIsOpen(currentIsOpen => {
                    if (!currentIsOpen) {
                      setNewMessage(true);
                    }
                    return currentIsOpen;
                  });
                  
                  scrollChat();
                  return {
                    ...prevChat,
                    messages: [...prevChat.messages, data]
                  };
                }
                return prevChat;
              });
            } else {
              apiGetChat(isAuthenticated().token, data._id).then(chat => {
                setChats(prev => {
                  const index = prev.findIndex(c => c._id === chat._id);
                  const newChats = [...prev];
                  if (index !== -1) {
                    newChats[index] = chat;
                  }
                  return newChats;
                });
              });
              setNewMessage(true);
            }
            return currentChatSelected;
          });
        });
      } catch (error) {
        console.log(error);
      }
    };

    initializeSocket();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.disconnect?.();
      }
    };
  }, []);

  const getChats = useCallback((isRefresh = false) => {
    return new Promise((resolve, reject) => {
      apiGetChats(isAuthenticated().token)
        .then(chatsData => {
          if (
            isRefresh &&
            chatsData.length &&
            chats.length &&
            chats.length < chatsData.length
          ) {
            setNewMessage(true);
            const audioElement = document.getElementById("msgDing") as HTMLAudioElement;
            audioElement?.play();
          }
          setChats(chatsData);
          setLoading(null);
          resolve(chatsData);
        })
        .catch(err => {
          reject(err);
        });
    });
  }, [chats.length]);

  const openChatWindow = useCallback(async () => {
    try {
      setIsOpen(true);
      setLoading("chats");
      setNewMessage(false);
      await getChats();
      scrollChat();
    } catch (error) {
      setLoading(null);
      console.log(error);
    }
  }, [getChats]);

  const closeChatWindow = useCallback(() => {
    setIsOpen(false);
    setChats([]);
  }, []);

  const createChat = useCallback(async () => {
    try {
      const usernameInput = document.getElementById("usernameSearch") as HTMLInputElement;
      const resp = await apiCreateChat(
        usernameInput.value,
        isAuthenticated().token
      );
      setChats(prev => [...prev, resp]);
      usernameInput.value = "";
    } catch (error) {
      switch (error) {
        case 400:
          toast("User not found, check spelling.");
          break;
        case 409:
          console.log("Chat exists, carry on...");
          break;

        default:
          toast("Something went wrong, please refresh and try again.");
          break;
      }
    }
  }, [toast]);


  const searchUser = useCallback((e: any) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setLoading("searchUsers");
    searchTimeoutRef.current = setTimeout(async () => {
      const usernameInput = document.getElementById("usernameSearch") as HTMLInputElement;
      const value = usernameInput.value;
      if (value === "" || value === " ") {
        setUserSearchResults([]);
        setLoading(null);
        return 0;
      }
      try {
        const resp = await apiSearchUser(isAuthenticated().token, value);
        setUserSearchResults(resp);
        setLoading(null);
        if (resp.length < 1) {
          throw new Error("404");
        }
      } catch (error) {
        if (error === 429) {
          toast("You're doing that too often, try again soon.");
        } else if (error === 404 || (error instanceof Error && error.message === "404")) {
          toast("No users found.");
        } else {
          toast("Something went wrong. Please refresh and try again");
        }

        setLoading(null);
      }
    }, 200);
  }, [toast]);

  const selectUser = useCallback((e: any) => {
    const usernameInput = document.getElementById("usernameSearch") as HTMLInputElement;
    usernameInput.value = e.target.dataset.username;
    createChat();
    setUserSearchResults([]);
  }, [createChat]);

  const getChat = useCallback(async (e: any) => {
    try {
      const id = e.currentTarget.dataset.id;

      setLoading(id);

      const chat = await apiGetChat(isAuthenticated().token, id);

      setChatSelected(true);
      setSelectedChat(chat);
      setLoading(null);

      scrollChat();
    } catch (error) {
      setLoading(null);
      console.log(error);
    }
  }, []);

  const closeChat = useCallback(async () => {
    try {
      setChatSelected(false);
      setLoading("chats");
      setChats([]);

      await getChats();
      setSelectedChat({} as ChatData);
    } catch (error) {
      toast(
        "An error occurred while getting chats, check log for more info."
      );
      console.log(error);
    }
  }, [getChats, toast]);

  const sendChat = useCallback(async () => {
    try {
      const chatId = selectedChat._id;
      const chatInput = document.getElementById("chatBox") as HTMLInputElement;
      const message = chatInput.value;

      if (message.trim().length === 0) {
        throw new Error("Message empty.");
      }

      apiSendChat(chatId, message, isAuthenticated().token);

      chatInput.value = "";
      scrollChat();
    } catch (error) {
      console.log(error);
    }
  }, [selectedChat._id]);

  const chatIsFromUser = useCallback((from: string | ChatUser) => {
    const id = typeof from === 'string' ? from : from._id;
    return id === isAuthenticated().user._id;
  }, []);

  const scrollChat = useCallback(() => {
    const list = document.querySelector(".chatView") as HTMLElement;
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, []);

  const muteToggle = useCallback(() => {
    const newMutedState = !muted;
    localStorage.setItem("muted", newMutedState.toString());
    setMuted(newMutedState);
  }, [muted]);

  return (
    <div className="chatCont">
      {isAuthenticated() && (
        <div>
          <audio id="msgDing" src="/pop.wav" controls={false}></audio>
          {isOpen && (
            <div className="chatWindow bg-white p-3 rounded-lg border shadow-sm">
              {toastMsg && (
                <div
                  className={`d-flex justify-content-center align-items-center alert alert-${toastMsg.type} chatAlert`}
                >
                  <span style={{ fontSize: "0.8em" }}>
                    {toastMsg.message}
                  </span>
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center text-info">
                {!chatSelected && (
                  <div>
                    <span>Chat</span>
                  </div>
                )}
                {chatSelected && (
                  <div
                    className="cursor-pointer closeChat px-2"
                    onClick={closeChat}
                  >
                    <i className="fa fa-arrow-left"></i>
                  </div>
                )}
                {chatSelected && (
                  <div className="justify-self-center">
                    {
                      selectedChat.between?.filter(
                        e => e._id !== isAuthenticated().user._id
                      )[0]?.name
                    }
                  </div>
                )}
                <div>
                  <i
                    className={`fa ${
                      muted ? "fa-volume-mute" : "fa-volume-up"
                    } chatMute p-1 mr-2 cursor-pointer`}
                    onClick={muteToggle}
                  ></i>
                  <i
                    className="fa fa-angle-down closeChatWindow cursor-pointer p-2"
                    onClick={closeChatWindow}
                  ></i>
                </div>
              </div>

              {!chatSelected && (
                <div className={`chatList my-2`}>
                  {loading === "chats" && (
                    <div className="text-center">
                      <i className="fa fa-circle-notch loader"></i>
                    </div>
                  )}
                  {chats.length < 1 && (
                    <div className="text-center preChat py-5">
                      No chats yet!
                    </div>
                  )}
                  {chats
                    .sort((a, b) => {
                      let lastA, lastB;
                      try {
                        lastA = new Date(
                          a.messages[a.messages.length - 1].timestamp
                        ).getTime();
                      } catch (error) {
                        lastA = 0;
                      }

                      try {
                        lastB = new Date(
                          b.messages[b.messages.length - 1].timestamp
                        ).getTime();
                      } catch (error) {
                        lastB = 0;
                      }

                      if (lastA > lastB) {
                        return -1;
                      } else if (lastA < lastB) {
                        return 1;
                      } else {
                        return 0;
                      }
                    })
                    .map((chat, i) => {
                      return (
                        <div
                          className="cursor-pointer chat p-2 card chat text-info d-flex justify-content-between"
                          onClick={getChat}
                          key={chat._id}
                          data-id={chat._id}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <img
                              className="chatProfImg shadow-sm mx-3"
                              alt="Chat Profile"
                              src={`${
                                import.meta.env.VITE_API_URL
                              }/user/photo/${
                                chat.between.filter(
                                  e => e._id !== isAuthenticated().user._id
                                )[0]._id
                              }`}
                              onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = `${DefaultProfileImg}`;
                              }}
                            />
                            <div className="flex-grow-1">
                              <h6>
                                {
                                  chat.between.filter(
                                    e => e._id !== isAuthenticated().user._id
                                  )[0].name
                                }
                              </h6>
                              <div>
                                {chat.messages[chat.messages.length - 1] &&
                                  formatDistanceToNow(
                                    new Date(chat.messages[chat.messages.length - 1].timestamp),
                                    { addSuffix: true }
                                  )}
                              </div>
                            </div>
                            {loading === chat._id && (
                              <div className="d-flex justify-content-center align-items-center">
                                <i className="fa fa-circle-notch loader"></i>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Chat is open */}
              {chatSelected && (
                <div className="chatView my-2">
                  <div className="text-center preChat">
                    Start the conversation! Note that we may clear out
                    messages older than 3 months from time to time.
                  </div>
                  {selectedChat.messages?.map((msg, i) => {
                    return (
                      <div
                        key={msg.timestamp}
                        className={`
                          d-flex justify-content-between rounded-lg chatMsg 
                          ${chatIsFromUser(msg.from) ? "from" : ""}`}
                      >
                        <div className="msgText">{msg.message}</div>
                        <div className="msgTime">
                          {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!chatSelected && (
                <div className="input-group">
                  {(userSearchResults.length > 0 ||
                    loading === "searchUsers") && (
                    <div className="bg-white rounded-lg card usersFound">
                      {loading !== "searchUsers" ? (
                        userSearchResults.map(res => {
                          return (
                            <div
                              className="result"
                              key={res._id}
                              data-username={res.name}
                              onClick={selectUser}
                            >
                              {res.name}
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center px-2">
                          <i className="fa fa-circle-notch loader"></i>
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    id="usernameSearch"
                    type="text"
                    className="form-control border-primary rounded"
                    placeholder="Start typing a username"
                    onKeyUp={e => {
                      if (e.key === "Enter") {
                        createChat();
                      } else {
                        searchUser(e);
                      }
                    }}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary"
                      onClick={createChat}
                    >
                      <i className="fa fa-user-plus"></i>
                    </button>
                  </div>
                </div>
              )}

              {chatSelected && (
                <div className="input-group">
                  <input
                    id="chatBox"
                    type="text"
                    className="form-control border-primary"
                    placeholder="Type your message"
                    onKeyUp={e => {
                      if (e.key === "Enter") {
                        sendChat();
                      }
                    }}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary"
                      onClick={sendChat}
                    >
                      <i className="fa fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isOpen && (
            <div
              className="chatOpener bg-white"
              onClick={openChatWindow}
            >
              {newMessage && <div className="newMsgBadge"></div>}
              <i className="fa fa-comments"></i>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
