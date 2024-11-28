import React from "react";
import ChatList from "../../components/Chat/ChatList";
import MessageBoard from "../../components/Chat/MessageBoard";

const ChatPage = () => {
  return (
    <div className="py-6 padding-x">
      <div className="bg-[#F7F7F7] rounded-[30px] p-5">
        <div className="w-full bg-white rounded-[30px] grid grid-cols-3 gap-5 max-h-[90vh] overflow-hidden">
          <div className="col-span-1 hidden lg:block h-full">
            <ChatList />
          </div>
          <div
            className={`col-span-3 lg:col-span-2 h-full flex items-start py-20 lg:pt-52 justify-center`}
          >
            {/* <MessageBoard /> */}
            <div className="text-center space-y-4">
              <img
                src="/nochats-image.png"
                alt="nochats-image"
                className="w-[389.25px] h-[205px]"
              />
              <h3 className="font-bold text-lg blue-text">
                Its nice to chat with someone
              </h3>
              <p className="text-sm text-[#5c5c5c]">
                Pick a person from left menu and start your conversation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
