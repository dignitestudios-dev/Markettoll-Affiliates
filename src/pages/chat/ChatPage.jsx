import React, { useContext, useEffect, useState } from "react";
import ChatList from "../../components/Chat/ChatList";
import MessageBoard from "../../components/Chat/MessageBoard";
import { AuthContext } from "../../context/authContext";
import {
  collection,
  db,
  getDocs,
  onSnapshot,
  query,
} from "../../firebase/firebase";
import { useLocation } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const location = useLocation();

  const [seller, setSeller] = useState(location?.state?.data);
  const [singleOnline, setSingleOnline] = useState([]);

  const fetchMessages = async (senderId, seller, onlineStatus) => {
    setSingleOnline(onlineStatus);
    setSeller(seller);
    const messagesRef = collection(db, "chats", userId, senderId);
    const receiverRef = collection(db, "chats", senderId, userId);
    try {
      const messagesQuery = query(messagesRef);
      const receiverQuery = query(receiverRef);
      onSnapshot(messagesQuery, (querySnapshot) => {
        const messagesList = querySnapshot.docs.map((doc) => doc.data());
        setMessages((prevMessages) => {
          const mergedMessages = [...prevMessages, ...messagesList];
          console.log(mergedMessages, prevMessages, "merged", messagesList);
          const uniqueMessages = mergedMessages.filter(
            (message, index, self) =>
              index === self.findIndex((m) => m.messageId === message.messageId)
          );
          return messagesList;
        });
      });
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  useEffect(() => {
    fetchMessages(seller?.id, seller, []);
  }, []);

  const [showChatList, setShowChatList] = useState(false);

  const toggleChatList = () => {
    setShowChatList(!showChatList);
  };

  return (
    <div className="py-6 padding-x">
      <div className="bg-[#F7F7F7] rounded-[30px] p-5">
        <button
          className="block lg:hidden blue-bg py-2 text-white rounded-lg px-2"
          onClick={toggleChatList}
        >
          <IoReturnUpBackOutline size={20} />
        </button>
        <div className="w-full bg-white rounded-[30px] grid grid-cols-3 gap-5 max-h-[90vh] overflow-hidden">
          <div
            className={`col-span-3 lg:hidden h-full ${
              showChatList ? "block" : "hidden"
            }`}
          >
            <ChatList
              toggleChatList={toggleChatList}
              messagReal={messages}
              selectedUser={fetchMessages}
            />
          </div>
          <div className="col-span-1 hidden lg:block h-full">
            <ChatList messagReal={messages} selectedUser={fetchMessages} />
          </div>
          <div
            className={`col-span-3 lg:col-span-2 h-full flex items-start py-8 justify-center ${
              showChatList ? "hidden" : "block"
            }`}
          >
            {seller ? (
              <MessageBoard
                fetchMessages={fetchMessages}
                messages={messages}
                userId={userId}
                userInfo={user}
                seller={seller}
                singleOnline={singleOnline}
              />
            ) : (
              <>
                <div className="text-center h-[82vh]  space-y-4">
                  <div className="flex items-center h-full flex-col justify-center">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
