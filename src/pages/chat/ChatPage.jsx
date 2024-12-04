import React, { useContext, useState } from "react";
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

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const [seller, setSeller] = useState(location?.state?.data);
  const fetchMessages = async (senderId) => {
    setSeller(senderId);
    console.log(
      userId,
      senderId,
      senderId.lastMessage?.receiverId,
      "checkSenderId"
    );

    // Define the message collections for both sender and receiver
    const messagesRef = collection(
      db,
      "chats",
      userId,
      senderId.lastMessage?.receiverId
    ); // Sender's collection
    const receiverRef = collection(
      db,
      "chats",
      senderId.lastMessage?.receiverId,
      userId
    ); // Receiver's collection

    // Real-time updates using onSnapshot
    try {
      const messagesQuery = query(messagesRef);
      const receiverQuery = query(receiverRef);

      // Using onSnapshot to listen to real-time changes for sender's messages
      onSnapshot(messagesQuery, (querySnapshot) => {
        const messagesList = querySnapshot.docs.map((doc) => doc.data());
        setMessages((prevMessages) => {
          // Merge new messages with the previous ones, ensuring no duplicates
          const mergedMessages = [...prevMessages, ...messagesList];
          console.log(mergedMessages,"merged");
          
          const uniqueMessages = mergedMessages.filter(
            (message, index, self) =>
              index === self.findIndex((m) => m.messageId === message.messageId)
          );
          return messagesList;
        });
      });

      // // Using onSnapshot to listen to real-time changes for receiver's messages
      // onSnapshot(receiverQuery, (receiverSnapshot) => {
      //   const receiverMessagesList = receiverSnapshot.docs.map((doc) =>
      //     doc.data()
      //   );
      //   setMessages((prevMessages) => {
      //     // Merge new receiver messages with the previous ones, ensuring no duplicates
      //     const mergedMessages = [...prevMessages, ...receiverMessagesList];
      //     const uniqueMessages = mergedMessages.filter(
      //       (message, index, self) =>
      //         index === self.findIndex((m) => m.messageId === message.messageId)
      //     );
      //     return mergedMessages;
      //   });
      // });
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
                userInfo={user}
                seller={seller}
              />
            ) : (
              <>
                <div className="text-center h-[82vh] space-y-4">
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
