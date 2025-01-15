import React, { useContext, useEffect, useState } from "react";
import ChatListCard from "./ChatListCard";
import { CiSearch } from "react-icons/ci";
import { AuthContext } from "../../context/authContext";
import {
  collection,
  db,
  getDocs,
  onSnapshot,
  query,
} from "../../firebase/firebase";
import { BASE_URL } from "../../api/api";

const ChatList = ({ selectedUser, messagReal }) => {
  const [userList, setUserList] = useState([]);
  const [LastMessages, setLastMessages] = useState([]);
  const { user } = useContext(AuthContext);
  const [originalUserList, setOriginalUserList] = useState([]);
  const userId = user?._id;

  const fetchUsers = async () => {
    const chatId = userId;
    const sellerRef = collection(db, "chats", chatId, "myUsers");

    try {
      const messagesQuery = query(sellerRef);
      const querySnapshot = await getDocs(messagesQuery);

      const userIds = querySnapshot.docs.map((doc) => doc.id);

      const promises = userIds.map((item) => {
        return fetch(`${BASE_URL}/users/profile-details/${item}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => data?.data);
      });

      // Resolving all promises and updating user data
      Promise.all(promises)
        .then((allData) => {
          const updatedUserList = allData.map((userData, index) => {
            return {
              ...userData,
              id: userIds[index], // Include the ID for each user
            };
          });

          setUserList(updatedUserList);
          setOriginalUserList(updatedUserList);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

      // Setting up real-time snapshot listener
      onSnapshot(sellerRef, (snapshot) => {
        // Capture updates from the Firestore collection in real-time
        const updatedUserList = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }; // Include the document ID with the data
        });

        // Optionally, update UI with real-time changes
        setLastMessages(updatedUserList);
      });
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userId, messagReal]);

  const filterUser = (e) => {
    const filterValue = e.target.value;
    if (filterValue === "") {
      setUserList(originalUserList);
    } else {
      const dataFilter = originalUserList.filter((item) =>
        item.lastMessage.profileName
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
      console.log(dataFilter, filterValue, originalUserList, "filteration");
      setUserList(dataFilter);
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
      <div className="w-full max-h-[80%] py-2 mt-14 overflow-y-scroll chat-list">
        {userList?.map((item, i) => (
          <>
            <ChatListCard
              item={item}
              lastMessage={LastMessages[i]}
              selectedUser={selectedUser}
            />
          </>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
