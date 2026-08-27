import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  addDoc,
  collection,
  db,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "../../firebase/firebase";
import { IoSend } from "react-icons/io5";
import { MdSupportAgent } from "react-icons/md";
import { SlEmotsmile } from "react-icons/sl";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const adminId = "67a2643f5892074cacec9d27";
  const chatId = userId ? `chat_${userId}_${adminId}` : null;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close emoji picker when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Send Push Notification to Admin
  const sendNotification = async (msgText) => {
    const fcmTokenMarkettoll = JSON.parse(
      localStorage.getItem("fcmTokenMarkettoll")
    );
    try {
      await axios.post(
        `${BASE_URL}/users/customer-support-chat-message-notification/${adminId}`,
        {
          title: "Chat Support Notification",
          attachments: [{ url: "https://image.png", type: "png" }],
          body: msgText,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
    } catch (error) {
      console.log("Chat support notification could not be sent:", error);
    }
  };

  // Real-time message listener
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, "Adminchats", chatId, "messages");
    const messagesQuery = query(messagesRef);

    const unsubscribe = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        const messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      },
      (error) => {
        console.error("Error fetching messages: ", error);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  // Send Message Handler
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (message.trim() === "" || !chatId || isSending) return;

    const currentMsg = message.trim();
    setIsSending(true);
    setMessage("");
    setShowEmojiPicker(false);

    const isFirstMsg = messages.length === 0;

    const messageData = {
      senderId: userId,
      text: currentMsg,
      timestamp: new Date().toISOString(),
    };

    try {
      const messagesRef = collection(db, "Adminchats", chatId, "messages");
      await addDoc(messagesRef, messageData);

      if (isFirstMsg) {
        await setDoc(
          doc(db, "Adminchats", chatId),
          {
            isautomatedmsg: true,
          },
          { merge: true }
        );
      }

      await setDoc(
        doc(db, "userChats", userId),
        {
          user: {
            name: user?.name || user?.userName || "User",
            pic: user?.profileImage || "",
          },
          chatId: chatId,
          lastMessage: currentMsg,
          timestamp: new Date().toISOString(),
        },
        { merge: true }
      );

      if (isFirstMsg) {
        const automatedReplyText =
          "Thank you for contacting the MarketToll Support Team. We have received your message, and one of our team members will reach out to you shortly to assist you. We appreciate your patience and look forward to helping you.";

        await addDoc(messagesRef, {
          senderId: adminId,
          text: automatedReplyText,
          timestamp: new Date().toISOString(),
        });

        await setDoc(
          doc(db, "userChats", userId),
          {
            user: {
              name: user?.name || user?.userName || "User",
              pic: user?.profileImage || "",
            },
            chatId: chatId,
            lastMessage: automatedReplyText,
            timestamp: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      sendNotification(currentMsg);
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="py-6 padding-x">
      <div className="bg-[#F7F7F7] rounded-[30px] p-4 md:p-6 shadow-sm">
        <div className="w-full bg-white rounded-[24px] grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-hidden min-h-[75vh] border border-gray-100 shadow-sm">
          {/* Left Sidebar - Admin Information */}
          <div className="col-span-1 border-b lg:border-b-0 lg:border-r border-gray-100 p-6 flex flex-col justify-between bg-gradient-to-b from-white to-[#f9fbff]">
            <div>
              <h2 className="blue-text font-bold text-2xl tracking-tight mb-4">
                Support Chat
              </h2>
              <div className="p-4 rounded-2xl bg-[#EBF5FB] border border-[#d2ecfa] flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full blue-bg flex items-center justify-center text-white text-3xl shadow-md shrink-0">
                  <MdSupportAgent />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#003DAC] text-base">
                      MarketToll Admin
                    </h3>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  </div>
                  {/* <p className="text-xs text-[#5c5c5c] mt-0.5">
                    Official Support Team
                  </p> */}
                </div>
              </div>

              {/* <div className="space-y-3 text-xs text-[#6B7280]">
                <div className="flex items-start gap-2">
                  <span className="text-[#0098EA] font-bold">•</span>
                  <p>Need help with your account, listings, or payments?</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#0098EA] font-bold">•</span>
                  <p>Our support team usually responds within minutes.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#0098EA] font-bold">•</span>
                  <p>Direct 1-on-1 private support conversation.</p>
                </div>
              </div> */}
            </div>

            {/* <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <span className="text-[11px] text-gray-400 font-medium">
                MarketToll Customer Care
              </span>
            </div> */}
          </div>

          {/* Right Message Area */}
          <div className="col-span-1 lg:col-span-2 flex flex-col justify-between h-[75vh] relative bg-white">
            {/* Chat Header */}
            <div className="py-4 px-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full blue-bg flex items-center justify-center text-white text-xl">
                  <MdSupportAgent />
                </div>
                <div>
                  <h4 className="font-bold text-sm md:text-base text-gray-800">
                    MarketToll Admin Support
                  </h4>
                  <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Scrollable Board */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#FAFAFA]">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#5c5c5c] space-y-3 py-12">
                  <div className="w-16 h-16 rounded-full bg-[#EBF5FB] flex items-center justify-center text-3xl text-[#0098EA]">
                    <MdSupportAgent />
                  </div>
                  <h3 className="font-bold text-base text-gray-700">
                    Start a conversation with Admin
                  </h3>
                  <p className="text-xs text-gray-400 max-w-xs">
                    Type your message below. We're here to assist you with any
                    queries or issues.
                  </p>
                </div>
              ) : (
                messages
                  .sort(
                    (a, b) =>
                      new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
                  )
                  .map((item, index) => {
                    const isCurrentUser = item.senderId === userId;
                    return (
                      <div
                        key={item.id || index}
                        className={`w-full flex flex-col ${
                          isCurrentUser ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-[70%] p-3.5 rounded-2xl text-xs md:text-sm shadow-sm break-words whitespace-pre-wrap ${
                            isCurrentUser
                              ? "blue-bg text-white rounded-br-none"
                              : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                          }`}
                        >
                          {item.text || item.content}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {item.timestamp
                            ? new Date(item.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                    );
                  })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bar */}
            <div className="p-3 md:p-4 bg-white border-t border-gray-100 relative">
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-20 left-4 z-50 shadow-2xl rounded-2xl"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={320}
                    height={380}
                  />
                </div>
              )}

              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 border border-gray-200 rounded-2xl px-3 py-1.5 focus-within:border-[#0098EA] transition-colors bg-white"
              >
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="text-gray-400 hover:text-[#0098EA] p-1.5 transition-colors text-lg"
                  aria-label="Emoji Picker"
                >
                  <SlEmotsmile />
                </button>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message to Admin..."
                  className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent py-2 px-1"
                />

                <button
                  type="submit"
                  disabled={!message.trim() || isSending}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shrink-0 ${
                    message.trim() && !isSending
                      ? "blue-bg hover:opacity-90 active:scale-95 cursor-pointer shadow-md"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  aria-label="Send Message"
                >
                  <IoSend className="text-base ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
