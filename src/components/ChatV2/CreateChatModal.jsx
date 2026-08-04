import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const CreateChatModal = ({ isOpen, onClose, onCreateChat }) => {
  const [userName, setUserName] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !targetUserId.trim()) return;

    setLoading(true);
    try {
      if (onCreateChat) {
        await onCreateChat({
          userName: userName.trim(),
          targetUserId: targetUserId.trim(),
          orderId: orderId.trim(),
          initialMessage: initialMessage.trim(),
        });
      }
      setUserName("");
      setTargetUserId("");
      setOrderId("");
      setInitialMessage("");
      onClose();
    } catch (err) {
      console.error("Error creating chat:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Create New Chat Room</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              User Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Seller"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0098EA] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Target User ID / Admin ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. admin_id"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0098EA] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Order ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. order123"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0098EA] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Initial Message (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Hello, I have a question about my order."
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#0098EA] transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !userName.trim() || !targetUserId.trim()}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#0098EA] hover:bg-blue-600 rounded-xl shadow transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChatModal;
