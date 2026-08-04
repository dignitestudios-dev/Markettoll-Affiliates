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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
              <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] lg:max-w-[55%] ${isSentByMe ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${isSentByMe
                    ? "bg-[#0095FF] text-white rounded-tr-none shadow-sm"
                    : "bg-[#F2F4F7] text-gray-800 rounded-tl-none"
                    }`}
                >
                  {msg.message}
                </div>

                {/* Time */}
                <span className="text-[11px] text-gray-400 mt-1 px-1 font-medium">
                  {formatTime(msg) || msg.time || ""}
                </span>
              </div>
                 <div ref={messagesEndRef} />
            </div>
          </React.Fragment>
        );
      })}

    </div>
  );
};

export default ChatMessages;
