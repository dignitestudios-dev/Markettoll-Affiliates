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
  const { user, OnOF } = useContext(AuthContext);
  const [originalUserList, setOriginalUserList] = useState([]);
  const userId = user?._id;
  const [onlineStatus, setOnlineStatus] = useState([]);
  const chatId = userId;
  const sellerRef = collection(db, "chats", chatId, "myUsers");

  const getStatusDataForUserIds = async (userIds) => {
    // Fetch all statuses at once instead of individually subscribing
    const statusRefs = userIds.map((userId) => doc(db, "status", userId));
    const statusSnapshots = await Promise.all(
      statusRefs.map((ref) => getDoc(ref))
    );

    const updatedStatuses = statusSnapshots.reduce((acc, docSnap, index) => {
      if (docSnap.exists()) {
        acc.push({ ...docSnap.data(), userId: userIds[index] });
      }
      return acc;
    }, []);

    setOnlineStatus(updatedStatuses); // Update online status in one batch
  };

  const fetchUsers = async () => {
    try {
      // Fetch users once and get their IDs
      const messagesQuery = query(sellerRef);
      const querySnapshot = await getDocs(messagesQuery);
      const userIds = querySnapshot.docs.map((doc) => doc.id);

      // Fetch the status data for all user IDs
      await getStatusDataForUserIds(userIds);

      // Now set the LastMessages with the status data attached
      const updatedUserList = querySnapshot.docs.map((doc, i) => {
        return {
          isOnline:
            onlineStatus.find((status) => status.userId === doc.id) || false,
          id: doc.id,
          ...doc.data(),
        };
      });

      setLastMessages(updatedUserList);
      setOriginalUserList(updatedUserList);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userId, onlineStatus]);

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
      setLastMessages(dataFilter);
    }
  };

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
            aTimestamp?.seconds * 1000 + aTimestamp?.nanoseconds / 1000000;
          const bMillis =
            bTimestamp?.seconds * 1000 + bTimestamp?.nanoseconds / 1000000;

          return bMillis - aMillis; // Sorting in descending order (latest first)
        })?.map((item, i) => (
          <ChatListCard
            key={i} // Always use a unique "key" for mapped elements.
            item={item}
            toggleChatList={toggleChatList}
            onlineStatus={onlineStatus}
            lastMessage={LastMessages[i]}
            selectedUser={selectedUser}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
