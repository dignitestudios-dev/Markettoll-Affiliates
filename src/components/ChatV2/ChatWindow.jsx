import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatWindow = ({
  selectedUser,
  messages = [],
  onSendMessage,
  onBackMobile,
  currentUserId,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <ChatHeader
        selectedUser={selectedUser}
        onBackMobile={onBackMobile}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
      />

      {/* Messages Stream — min-h-0 prevents flex child from overflowing */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatMessages messages={messages} currentUserId={currentUserId} />
      </div>

      {/* Message Composer */}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
