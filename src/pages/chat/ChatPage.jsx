import React, { useContext, useState } from "react";
import ChatList from "../../components/Chat/ChatList";
import MessageBoard from "../../components/Chat/MessageBoard";
import { AuthContext } from "../../context/authContext";
import { collection, db, getDocs, query } from "../../firebase/firebase";

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [seller, setSeller] = useState();
  const fetchMessages = async (senderId) => {
    setSeller(senderId);
    const messagesRef = collection(
      db,
      "chats",
      userId,
      senderId.lastMessage.senderId
    );
    const reciverRef = collection(
      db,
      "chats",
      senderId.lastMessage.senderId,
      userId
    );
    try {
      const messagesQuery = query(messagesRef);
      const reciverQuery = query(reciverRef);
      const querySnapshot = await getDocs(messagesQuery);
      const receiverSnapshot = await getDocs(reciverQuery);
      const messagesList = querySnapshot.docs.map((doc) => doc.data());
      const ReveivermessagesList = receiverSnapshot.docs.map((doc) => doc.data());
      const mergedMessages = [...messagesList, ...ReveivermessagesList]; 
      setMessages(mergedMessages);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };
  

  return (
    <div className="py-6 padding-x">
      <div className="bg-[#F7F7F7] rounded-[30px] p-5">
        <div className="w-full bg-white rounded-[30px] grid grid-cols-3 gap-5 max-h-[90vh] overflow-hidden">
          <div className="col-span-1 hidden lg:block h-full">
            <ChatList selectedUser={fetchMessages} />
          </div>
          <div
            className={`col-span-3 lg:col-span-2 h-full flex items-start py-8  justify-center`}
          >
            {seller ? (
              <MessageBoard
              fetchMessages={fetchMessages}
                messages={messages}
                userId={userId}
                seller={seller}
              />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
