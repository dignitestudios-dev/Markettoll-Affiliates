import React from "react";
import { collection, db, deleteDoc, doc, getDocs } from "../../firebase/firebase";
import { toast } from "react-toastify";

const BlockAndDeleteModal = ({ state, onclose,userId,sellerId,seller,fetchMessages }) => {
  const deleteChat = async () => {
    try {
      const chatId = userId;
      const receiverId = sellerId;
      const senderMessagesRef = collection(db, "chats", chatId, receiverId);
      const receiverMessagesRef = collection(db, "chats", receiverId, chatId);
      const senderMessagesSnapshot = await getDocs(senderMessagesRef);
      senderMessagesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      const receiverMessagesSnapshot = await getDocs(receiverMessagesRef);
      receiverMessagesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      await deleteDoc(doc(db, "chats", chatId, "myUsers", receiverId));
      await deleteDoc(doc(db, "chats", receiverId, "myUsers", chatId));

      fetchMessages(receiverId, seller);

      onclose();
    } catch (error) {
      console.error("Error deleting chat: ", error);
      toast.error("Error deleting the chat. Please try again.");
    }
  };

  return (
    state && (
      <div
        className={`w-full h-screen fixed inset-0 z-50 flex items-center justify-center padding-x py-6 bg-[rgba(0,0,0,0.4)]`}
      >
        <div className="bg-white p-6 rounded-xl w-full md:w-[330px] h-[133px] relative">
          <p className="text-[17px] font-semibold">{"Delete Chat"}</p>
          <p className="">{"Are you sure you want to delete chat?"}</p>
          <div className="w-full flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={deleteChat}
              className="text-[13px] font-semibold text-[#FF3B30]"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onclose}
              className="text-[13px] font-semibold text-[#000]"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default BlockAndDeleteModal;
