import React, { useContext, useEffect, useState } from "react";
import ChatListCard from "./ChatListCard";
import { CiSearch } from "react-icons/ci";
import { AuthContext } from "../../context/authContext";
import {
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "../../firebase/firebase";
import { BASE_URL } from "../../api/api";

const ChatList = ({ selectedUser, toggleChatList }) => {
  const [userList, setUserList] = useState([]);
  const [LastMessages, setLastMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const [originalUserList, setOriginalUserList] = useState([]);
  const userId = user?._id;
  const [onlineStatus, setOnlineStatus] = useState([]);

  const getStatusDataForUserIds = (userIds) => {
    userIds.forEach((userId) => {
      const userRef = doc(db, "status", userId);
      onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const statusData = docSnap.data();
          setOnlineStatus((prevStatus) => {
            const existingStatusIndex = prevStatus.findIndex(
              (status) => status.userId === userId
            );
            if (existingStatusIndex !== -1) {
              prevStatus[existingStatusIndex] = { ...statusData, userId };
            } else {
              prevStatus.push({ ...statusData, userId });
            }
            return [...prevStatus]; // Return a new array to trigger re-render
          });
        }
      });
    });
  };

  const fetchUsers = async () => {
    const chatId = userId;
    const sellerRef = collection(db, "chats", chatId, "myUsers");

    try {
      const messagesQuery = query(sellerRef);
      const querySnapshot = await getDocs(messagesQuery);
      const userIds = querySnapshot.docs.map((doc) => doc.id);
      getStatusDataForUserIds(userIds);
      onSnapshot(sellerRef, (snapshot) => {
        const updatedUserList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLastMessages(updatedUserList);
        setOriginalUserList(updatedUserList);
      });
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userId]);

  const filterUser = (e) => {
    const filterValue = e.target.value;
    if (filterValue === "") {
      setLastMessages(originalUserList);
    } else {
      const dataFilter = originalUserList.filter((item) =>
        item.lastMessage.profileName
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
      console.log(dataFilter, filterValue, originalUserList, "filteration");
      setLastMessages(dataFilter);
    }
  };

  console.log(
    LastMessages,

    "lastMessagegestt"
  );

  return (
    <div className="w-full h-full border-r  overflow-hidden  pr-5">
      <div className="w-full  h-[15%] px-5 pt-5">
        <h2 className="blue-text font-bold text-[28px]">Chat</h2>

        <div className="w-full border my-3" />

        <div className="w-full border rounded-2xl px-3 bg-white flex items-center justify-between gap-2">
          <input
            type="text"
            placeholder="Search"
            onChange={filterUser}
            className="text-sm font-normal text-[#5C5C5C] w-full py-2.5 outline-none"
          />
          <CiSearch className="light-blue-text text-xl" />
        </div>
      </div>
      <div
        className={`w-full ${
          toggleChatList ? "mt-20" : "mt-10"
        }  max-h-[80%] py-2  overflow-y-scroll chat-list`}
      >
        {LastMessages?.sort((a, b) => {
          const aTimestamp = a?.lastMessage?.timestamp;
          const bTimestamp = b?.lastMessage?.timestamp;

          // Convert Firebase timestamp to milliseconds
          const aMillis =
            aTimestamp.seconds * 1000 + aTimestamp.nanoseconds / 1000000;
          const bMillis =
            bTimestamp.seconds * 1000 + bTimestamp.nanoseconds / 1000000;

          return bMillis - aMillis; // Sorting in descending order (latest first)
        })?.map((item, i) => (
          <ChatListCard
            key={i} // Always use a unique "key" for mapped elements.
            item={item}
            toggleChatList={toggleChatList}
            onlineStatus={onlineStatus[i]}
            lastMessage={LastMessages[i]}
            selectedUser={selectedUser}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
