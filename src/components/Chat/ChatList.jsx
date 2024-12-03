import React, { useContext, useEffect, useState } from "react";
import ChatListCard from "./ChatListCard";
import { CiSearch } from "react-icons/ci";
import { AuthContext } from "../../context/authContext";
import { collection, db, getDocs, query } from "../../firebase/firebase";

const ChatList = ({selectedUser}) => {
  const [userList,setUserList]=useState([]);
  const { user } = useContext(AuthContext);
  const userId = user?._id;
  
  const [originalUserList, setOriginalUserList] = useState([]);
  const fetchUsers = async () => {
    const chatId = userId;
    const sellerRef = collection(db, "chats", chatId, "myUsers");
    try {
      const messagesQuery = query(sellerRef);
      const querySnapshot = await getDocs(messagesQuery);
      const userList = querySnapshot.docs.map((doc) => doc.data());
      setUserList(userList);
      setOriginalUserList(userList); 
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };
  useEffect(()=>{
    fetchUsers();
  },[])
  
  const filterUser = (e) => {
    const filterValue = e.target.value;
    if (filterValue === "") {
      setUserList(originalUserList);
    } else {
      const dataFilter = originalUserList.filter(
        (item) => item.lastMessage.profileName.toLowerCase().includes(filterValue.toLowerCase())
      );
      console.log(dataFilter, filterValue, originalUserList, "filteration");
      setUserList(dataFilter);
    }
  };
  
  return (
    <div className="w-full h-full border-r overflow-hidden pr-5">
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
        {
          userList?.map((item)=>(
            <ChatListCard item={item} selectedUser={selectedUser} />
          ))
        }
      </div>
    </div>
  );
};

export default ChatList;
