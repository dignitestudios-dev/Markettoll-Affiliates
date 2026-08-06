import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoAdd } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import ChatUserCard from "./ChatUserCard";
import CreateChatModal from "./CreateChatModal";

const ChatSidebar = ({
  users = [],
  selectedUser,
  onSelectUser,
  searchQuery,
  setSearchQuery,
  onCreateChat,
  currentUserId,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };


  return (
    <div className="w-full h-full flex flex-col pr-0 lg:pr-4 border-r-0 lg:border-r border-gray-100 min-h-0 overflow-hidden">
      {/* Create Chat Modal */}
      <CreateChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateChat={onCreateChat}
      />

      {/* Top Header Section */}
      <div className="pt-2 px-1 pb-3 shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-[#0098EA] hover:text-blue-600 text-sm font-medium transition-colors mb-2"
        >
          <IoChevronBack className="text-base" />
          <span>Back</span>
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold blue-text tracking-tight">
            Chat
          </h1>

          {/* New Chat Button */}
          {/* <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 bg-[#0098EA] hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow transition-all cursor-pointer"
          >
            <IoAdd size={16} />
            <span>New Chat</span>
          </button> */}
        </div>

        <div className="w-full border-b border-gray-200/70 my-3" />

        {/* Search Bar */}
        <div className="w-full border border-gray-200 rounded-full px-4 py-2 bg-white flex items-center justify-between shadow-sm focus-within:border-[#0098EA] transition-all">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm text-gray-700 w-full outline-none bg-transparent placeholder:text-gray-400"
          />
          <CiSearch className="light-blue-text text-xl shrink-0 cursor-pointer" />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 min-h-0 max-h-[480px] lg:max-h-[550px] overflow-y-auto chat-list space-y-1 pr-1 mt-1">
        {users?.length > 0 ? (
          users?.map((item, index) => (
            <ChatUserCard
              key={item?.id || item?._id || index}
              item={item}
              currentUserId={currentUserId}
              isSelected={Boolean(
                selectedUser?.id && selectedUser.id === item.id
              )}
              onSelect={() => onSelectUser(item)}
            />
          ))
        ) : (
          <div className="text-center text-sm text-gray-400 py-8">
            No chats found
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
