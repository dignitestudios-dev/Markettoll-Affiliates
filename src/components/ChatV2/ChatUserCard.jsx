import React from "react";

const ChatUserCard = ({ item, isSelected, onSelect, currentUserId }) => {
  const name = item?.user_name || item?.name || "User";
  const image =
    item?.image ||
    item?.profileImage ||
    item?.lastMessage?.profileImage ||
    "/chat-img.png";
  const lastMsg = item?.last_msg?.message || item?.last_msg?.content || item?.lastMessageText || "";

  // Check if unread (currentUserId is NOT in seen_by array)
  const seenBy = item?.last_msg?.seen_by;
  const isUnread = Boolean(
    currentUserId &&
      Array.isArray(seenBy) &&
      !seenBy.includes(currentUserId)
  );

  let date = "Today";
  const createdAt = item?.last_msg?.created_at || item?.created_at || item?.createdAt;
  if (createdAt) {
    try {
      let dateObj = null;
      if (typeof createdAt.toDate === "function") {
        dateObj = createdAt.toDate();
      } else if (createdAt.seconds) {
        dateObj = new Date(createdAt.seconds * 1000);
      } else {
        dateObj = new Date(createdAt);
      }

      if (dateObj && !isNaN(dateObj.getTime())) {
        date = dateObj
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(",", "");
      }
    } catch (e) {
      date = "Today";
    }
  }
  console.log(isSelected,"isSelected")

  return (
    <div
      onClick={onSelect}
      className={`relative w-full flex items-center justify-between p-3 cursor-pointer transition-colors duration-150 rounded-xl ${
        isSelected
          ? "bg-[#F3F8FF] text-[#0A2540]"
          : "hover:bg-gray-50 text-gray-700"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative shrink-0">
          <img
            src={image}
            alt={name}
            className="w-11 h-11 rounded-full object-cover border border-gray-100"
            onError={(e) => {
              e.target.src = "/chat-img.png";
            }}
          />
          {isUnread && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#0098EA] border-2 border-white rounded-full" />
          )}
        </div>

        <div className="min-w-0 flex-1 pr-2">
          <h4
            className={`text-sm truncate ${
              isUnread ? "font-bold text-black" : "font-semibold text-gray-900"
            }`}
          >
            {name} {item?.order_id ? `#${item.order_id}` : ""}
          </h4>
          <p
            className={`text-xs truncate mt-0.5 ${
              isUnread ? "font-bold text-gray-900" : "font-normal text-gray-400"
            }`}
          >
            {lastMsg}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right self-start pt-1">
        <span
          className={`text-[11px] whitespace-nowrap ${
            isUnread ? "font-bold text-[#0098EA]" : "font-medium text-gray-400"
          }`}
        >
          {date}
        </span>
      </div>

      {isSelected && (
        <div className="absolute right-0 top-1 bottom-1 w-1 bg-[#0098EA] rounded-l-md" />
      )}
    </div>
  );
};

export default ChatUserCard;
