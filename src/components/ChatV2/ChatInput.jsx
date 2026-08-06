import React, { useState, useRef } from "react";
import { SlEmotsmile } from "react-icons/sl";
import { IoSend, IoImageOutline } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import EmojiPicker from "emoji-picker-react";

const ChatInput = ({ onSendMessage, onSendImage }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (onSendImage) {
      try {
        setUploading(true);
        await onSendImage(files);
      } catch (err) {
        console.error("Error uploading image:", err);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative w-full p-3 lg:p-4 bg-white rounded-b-2xl">
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-30 shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={350} />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />

      <form
        onSubmit={handleSend}
        className="w-full border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 lg:gap-3 bg-white focus-within:border-[#0095FF] transition-colors"
      >
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-[#0095FF] hover:text-blue-600 transition-colors p-1 shrink-0"
          title="Add Emoji"
        >
          <SlEmotsmile className="text-xl" />
        </button>

        {/* Image Attachment Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="text-[#0095FF] hover:text-blue-600 transition-colors p-1 shrink-0 disabled:opacity-50"
          title="Attach Image"
        >
          {uploading ? (
            <CgSpinner className="text-xl animate-spin text-[#0095FF]" />
          ) : (
            <IoImageOutline className="text-xl" />
          )}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={uploading ? "Uploading image..." : "Message"}
          disabled={uploading}
          className="w-full text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-400"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || uploading}
          className={`w-9 h-9 rounded-full bg-[#0095FF] hover:bg-blue-600 active:scale-95 text-white flex items-center justify-center shrink-0 transition-all shadow-md ${
            !message.trim() || uploading ? "opacity-90 cursor-pointer" : "cursor-pointer"
          }`}
        >
          <IoSend className="text-sm ml-0.5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
