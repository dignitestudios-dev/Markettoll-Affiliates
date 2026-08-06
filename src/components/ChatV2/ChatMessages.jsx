import React, { useEffect, useRef } from "react";

// Get a Date object safely from Firestore timestamp or plain date
const getDateObj = (ts) => {
  if (!ts) return null;
  try {
    if (typeof ts.toDate === "function") return ts.toDate();
    if (ts.seconds) return new Date(ts.seconds * 1000);
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

// Return "Today", "Yesterday", or "DD MMM YYYY"
const getDateLabel = (dateObj) => {
  if (!dateObj) return null;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (isSameDay(dateObj, today)) return "Today";
  if (isSameDay(dateObj, yesterday)) return "Yesterday";

  return dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Return "HH:MM AM/PM" from a message's timestamp
const formatTime = (msg) => {
  const ts = msg.created_at || msg.createdAt || msg.timestamp;
  const d = getDateObj(ts);
  if (!d) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatMessages = ({ messages = [], currentUserId }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  // Track which date labels have already been rendered
  const renderedDates = new Set();

  return (
    <div className="w-full h-[400px] overflow-y-auto chat-list p-4 lg:p-6 space-y-3">
      {messages.map((msg, index) => {
        const senderId = msg.sender_id || msg.senderId;
        const isSentByMe = currentUserId
          ? senderId === currentUserId
          : Boolean(msg.isSent);

        const ts = msg.created_at || msg.createdAt || msg.timestamp;
        const dateObj = getDateObj(ts);
        const dateLabel = getDateLabel(dateObj);

        // Show date separator only once per unique day
        const showDateBadge = dateLabel && !renderedDates.has(dateLabel);
        if (showDateBadge) renderedDates.add(dateLabel);

        const isImage =
          msg.contentType === "image" ||
          (typeof msg.message === "string" &&
            msg.message.startsWith("http") &&
            (msg.message.match(/\.(jpeg|jpg|gif|png|webp)/i) ||
              msg.message.includes("/user/") ||
              msg.message.includes("upload")));

        return (
          <React.Fragment key={msg.id || index}>
            {/* Date Separator Badge */}
            {showDateBadge && (
              <div className="flex justify-center my-3">
                <span className="text-xs text-gray-400 font-medium bg-gray-100 rounded-full px-3 py-1">
                  {dateLabel}
                </span>
              </div>
            )}

            {/* Message Row */}
            <div className={`w-full flex ${isSentByMe ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col min-w-0 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${isSentByMe ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                <div
                  className={`p-1.5 sm:p-2 rounded-2xl text-sm leading-relaxed break-words break-all [overflow-wrap:anywhere] whitespace-pre-wrap ${
                    isImage ? "bg-transparent p-0" : isSentByMe
                    ? "bg-[#0095FF] text-white rounded-tr-none shadow-sm px-4 py-2.5"
                    : "bg-[#F2F4F7] text-gray-800 rounded-tl-none px-4 py-2.5"
                  }`}
                >
                  {isImage ? (
                    <a href={msg.message} target="_blank" rel="noopener noreferrer">
                      <img
                        src={msg.message}
                        alt="Photo"
                        className="max-w-[200px] max-h-[200px] sm:max-w-[260px] sm:max-h-[260px] rounded-2xl object-cover cursor-pointer shadow-sm hover:opacity-95 transition-opacity border border-gray-100"
                      />
                    </a>
                  ) : (
                    msg.message
                  )}
                </div>

                {/* Time */}
                <span className="text-[11px] text-gray-400 mt-1 px-1 font-medium">
                  {formatTime(msg) || msg.time || ""}
                </span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {/* Scroll anchor — always at the very bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
