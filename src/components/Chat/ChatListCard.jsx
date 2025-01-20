import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import {
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "../../firebase/firebase";

const ChatListCard = ({
  item,
  selectedUser,
  lastMessage,
  onlineStatus,
  toggleChatList,
}) => {
  const { user, setIsBlockedByUser, setHasBlocked } = useContext(AuthContext);
;
  return (
    <div
      onClick={async () => {
        if (toggleChatList) {
          toggleChatList();
        }
        // console.log("lastMessage >>>", lastMessage);
        const chatId = user?._id;
        // console.log(chatId, "iduser");

        const sellerRef = collection(db, "chats", chatId, "myUsers");
        try {
          //  Checking Blocked User
          const userDoc = await getDoc(doc(db, "blockStatus", user?._id));
          const sellerDoc = await getDoc(
            doc(db, "blockStatus", lastMessage?.id)
          );

          if (userDoc.exists() && sellerDoc.exists()) {
            const userBlockedList = userDoc.data().blockedUsers || [];
            const sellerBlockedList = sellerDoc.data().blockedUsers || [];
            setHasBlocked(userBlockedList.includes(lastMessage?.id));
            setIsBlockedByUser(sellerBlockedList.includes(user?._id));
          } else {
            setHasBlocked(false);
            setIsBlockedByUser(false);
          }
          //  Checking Blocked User

          selectedUser(
            lastMessage?.id,
            lastMessage,
            lastMessage?.isOnline?.isOnline
          );

          const messagesQuery = query(sellerRef);
          const querySnapshot = await getDocs(messagesQuery);

          querySnapshot.forEach(async (messageDoc) => {
            if (messageDoc?.id === lastMessage?.id) {
              console.log(lastMessage?.id, "myUserIdss");
              const messageDocRef = doc(
                db,
                "chats",
                chatId,
                "myUsers",
                lastMessage?.id
              );

              try {
                await updateDoc(messageDocRef, {
                  "lastMessage.isRead": true,
                });
                console.log(`Document ${messageDoc.id} updated successfully.`);
              } catch (error) {
                console.error("Error updating document: ", error);
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      }}
      className={`py-3 px-5 flex items-start justify-between 
        ${
          lastMessage?.lastMessage?.userSendId !== user?._id &&
          !lastMessage?.lastMessage?.isRead
            ? "border-b-2 border-b-[#0098EA] bg-gray-100"
            : "border-b-2 border-b "
        } 
        hover:bg-gray-50 transition-all duration-300 cursor-pointer`}
    >
      <div className="flex items-center gap-2">
        <div className="flex relative">
          <img
            src={
              lastMessage?.lastMessage?.profileImage
                ? lastMessage?.lastMessage?.profileImage
                : "/chat-img.png"
            }
            alt="chat-img"
            className="w-[42px] rounded-full h-[42px]"
          />
          <span
            className={`flex absolute -right-[10px] w-3 h-3 me-3 ${
              lastMessage?.isOnline?.isOnline
                ? "bg-green-300"
                : "bg-yellow-300"
            } rounded-full`}
          />
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[13px] flex items-center">
            {lastMessage?.lastMessage?.profileName}{" "}
          </span>

          <span
            className={` ${
              lastMessage?.lastMessage?.userSendId != user?._id &&
              !lastMessage?.lastMessage?.isRead
                ? "font-bold text-sm text-[#404040]"
                : "text-xs text-[#757575]"
            } `}
          >
            {lastMessage?.lastMessage?.contentType == "text"
              ? lastMessage?.lastMessage?.content
              : ""}
          </span>
        </div>
      </div>
      <div className="w-[20%] text-end">
        <div className="flex items-center">
          {/* {lastMessage?.lastMessage?.userSendId!=user?._id &&!lastMessage?.lastMessage?.isRead && (
            <span className="flex w-3 h-3 me-3 p-[6px] bg-red-300 rounded-full"></span>
          )} */}

          <span className="text-xs text-nowrap font-medium">
            {new Date(
              lastMessage?.lastMessage?.timestamp?.toDate()
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatListCard;
