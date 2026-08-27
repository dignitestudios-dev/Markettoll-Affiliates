import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../api/api";
import ChatSidebar from "../../components/ChatV2/ChatSidebar";
import ChatWindow from "../../components/ChatV2/ChatWindow";
import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    onSnapshot,
    orderBy,
    query,
    where,
    arrayUnion,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { AuthContext } from "../../context/authContext";

/**
 * Creates or fetches an existing chat room in "chat-v2" collection.
 * Only [userId, adminId] will be added to the user_id array.
 * 
 * @param {Object} params
 * @param {string} params.userId - Your current User ID
 * @param {string} [params.adminId] - Static Admin ID (defaults to "admin_id")
 * @param {string} [params.userName] - Display name for the chat room
 * @param {string} [params.orderId] - Optional order ID
 * @param {string} [params.initialMessage] - Optional initial message text
 * @returns {Promise<string>} Returns the chat room Document ID
 */
export const createChatRoom = async ({
    userId,
    adminId = "admin_id",
    userName = "User",
    orderId = "",
    initialMessage = "",
}) => {
    try {
        if (!userId) {
            console.error("userId is required to create a chat room");
            return null;
        }

        const chatRef = collection(db, "chat-v2");

        // 1. If orderId provided, strictly check if a room with same order_id already exists
        if (orderId && userId) {
            const orderQuery = query(
                chatRef,
                where("user_id", "array-contains", userId),
                where("order_id", "==", String(orderId)),
                where("chat_status", "==", true)
            );
            const orderSnapshot = await getDocs(orderQuery);
            if (!orderSnapshot.empty) {
                const existingByOrder = orderSnapshot.docs[0];
                console.log("Chat room already exists for order_id:", orderId, existingByOrder.id);
                return existingByOrder.id;
            }
        }

        // 2. Fallback: check by userId + adminId match
        const q = query(
            chatRef,
            where("user_id", "array-contains", userId),
            where("chat_status", "==", true)
        );

        const snapshot = await getDocs(q);
        const existingRoom = snapshot.docs.find((docSnap) => {
            const orderIds = String(docSnap.data()?.order_id || "");
            const targetOrderId = String(orderId || "");
            const userIds = docSnap.data()?.user_id || [];
            return orderIds === targetOrderId && userIds.includes(userId);
        });

        // Return existing room ID if found
        if (existingRoom) {
            console.log("Chat room already exists:", existingRoom.id);
            return existingRoom.id;
        }

        const automatedReplyText =
            "Thank you for contacting the MarketToll Support Team. We have received your message, and one of our team members will reach out to you shortly to assist you. We appreciate your patience and look forward to helping you.";

        // Create a new chat room with ONLY [userId, adminId] in user_id array
        const newRoomData = {
            user_id: [userId, adminId],
            user_name: userName,
            order_id: orderId ? String(orderId) : "",
            chat_status: true,
            is_online: false,
            created_at: serverTimestamp(),
            ...(initialMessage ? { isautomatedmsg: true } : {}),
            last_msg: {
                message: initialMessage ? automatedReplyText : (initialMessage || "Chat started"),
                seen_by: initialMessage ? [adminId] : [userId],
                created_at: serverTimestamp(),
            },
        };

        const newRoomRef = await addDoc(chatRef, newRoomData);
        console.log("New chat room created with ID:", newRoomRef.id);

        // Add initial message to subcollection if provided
        if (initialMessage) {
            const messagesRef = collection(
                doc(db, "chat-v2", newRoomRef.id),
                "messages"
            );
            await addDoc(messagesRef, {
                message: initialMessage,
                sender_id: userId,
                seen_by: [userId],
                created_at: serverTimestamp(),
            });

            await addDoc(messagesRef, {
                message: automatedReplyText,
                sender_id: adminId,
                seen_by: [adminId],
                created_at: serverTimestamp(),
            });
        }

        return newRoomRef.id;
    } catch (error) {
        console.error("Error in createChatRoom:", error);
        throw error;
    }
};

const ChatV2 = () => {
    const { user } = useContext(AuthContext);
    const userCookie = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const parsedUser = userCookie ? JSON.parse(userCookie) : null;
    const currentUserId = user?._id || user?.id || user?.user?._id || user?.user?.id || parsedUser?._id || parsedUser?.id || "user_id";
    const location = useLocation();

    const [usersList, setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [autoSelectedRoomId, setAutoSelectedRoomId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);

    const handleSelectUser = async (userItem) => {
        setSelectedUser(userItem);
        setShowMobileChat(true);

        const targetId = userItem?.id || userItem?._id;
        const seenBy = userItem?.last_msg?.seen_by || [];

        // Mark as seen on Firestore when user opens the chat
        if (currentUserId && targetId && (!Array.isArray(seenBy) || !seenBy.includes(currentUserId))) {
            try {
                const userDocRef = doc(db, "chat-v2", String(targetId));
                await updateDoc(userDocRef, {
                    "last_msg.seen_by": arrayUnion(currentUserId),
                });
            } catch (e) {
                console.error("Error updating seen_by:", e);
            }
        }
    };

    // Handler to create chat room from UI "+ New Chat" button
    const handleCreateChat = async ({ userName, targetUserId, orderId, initialMessage }) => {
        const buyerId = currentUserId || "admin_id";
        const roomId = await createChatRoom({
            userId: buyerId,
            adminId: targetUserId || "admin_id",
            userName: userName,
            orderId: orderId,
            initialMessage: initialMessage,
        });
        if (roomId) {
            setAutoSelectedRoomId(roomId);
        }
        return roomId;
    };

    const getChatTimestamp = (chat) => {
        const lastMsgTime = chat?.last_msg?.created_at || chat?.created_at || chat?.updatedAt;
        if (!lastMsgTime) return 0;
        if (typeof lastMsgTime?.toMillis === "function") {
            return lastMsgTime.toMillis();
        }
        if (typeof lastMsgTime?.seconds === "number") {
            return lastMsgTime.seconds * 1000 + Math.floor((lastMsgTime.nanoseconds || 0) / 1000000);
        }
        if (lastMsgTime instanceof Date) {
            return lastMsgTime.getTime();
        }
        if (typeof lastMsgTime === "number") {  
            return lastMsgTime;
        }
        if (typeof lastMsgTime === "string") {
            const parsed = Date.parse(lastMsgTime);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    // 1. Fetch chat rooms from "chat-v2" collection where "user_id" array contains user AND chat_status is true
    useEffect(() => {
        const targetId = currentUserId || "admin_id";
        const chatRef = collection(db, "chat-v2");

        // Query with array-contains on user_id AND chat_status == true
        const q = targetId
            ? query(
                chatRef,
                where("user_id", "array-contains", targetId),
                where("chat_status", "==", true)
            )
            : query(chatRef, where("chat_status", "==", true));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const chats = snapshot.docs
                    .map((docSnap) => ({
                        ...docSnap.data(),
                        id: docSnap.id,
                    }))
                    .filter((c) => c.chat_status === true);

                chats.sort((a, b) => getChatTimestamp(b) - getChatTimestamp(a));

                console.log(chats, "usersList==");
                setUsersList(chats);

                if (chats.length > 0) {
                    setSelectedUser((prev) => {
                        const navData = location.state?.data;
                        const navOrderId = navData?.orderId || navData?.order_id;
                        const navTargetId = navData?.adminId || navData?.id || navData?.lastMessage?.id;

                        // 1. Priority: Match auto-created/fetched room ID
                        if (autoSelectedRoomId) {
                            const matchById = chats.find((c) => (c.id || c._id) === autoSelectedRoomId);
                            if (matchById) return matchById;
                        }

                        // 2. Priority: Match strictly by order_id if navOrderId provided
                        if (navOrderId) {
                            const matchByOrder = chats.find(
                                (c) => String(c.order_id || c.orderId || "") === String(navOrderId)
                            );
                            if (matchByOrder) return matchByOrder;
                        }

                        // 3. Priority: Match by specific target user ID if provided
                        if (navTargetId && navTargetId !== "admin_id") {
                            const matchByUser = chats.find(
                                (c) => Array.isArray(c.user_id) && c.user_id.includes(navTargetId)
                            );
                            if (matchByUser) return matchByUser;
                        }

                        // 4. Priority: Preserve previously selected user if still present
                        if (prev) {
                            const found = chats.find(
                                (c) => (c.id || c._id) === (prev.id || prev._id)
                            );
                            if (found) return found;
                        }

                        return chats[0];
                    });
                } else {
                    setSelectedUser(null);
                }
            },
            (error) => {
                console.error("Error listening to chat-v2 collection:", error);
            }
        );

        return () => unsubscribe();
    }, [currentUserId, location.state, autoSelectedRoomId]);

    // Auto-create/fetch room if navigated from Chat with Admin or order details link
    useEffect(() => {
        const navData = location.state?.data;
        if (!navData || !currentUserId) return;

        const targetUserId = navData?.adminId || navData?.id || navData?.lastMessage?.id || "admin_id";
        const userName = navData?.userName || navData?.name || navData?.lastMessage?.profileName || navData?.profileName || "Admin";
        const orderId = navData?.orderId || navData?.order_id || "";
console.log(orderId,"orderId====")
        const handleAutoCreate = async () => {
            try {
                const roomId = await createChatRoom({
                    userId: currentUserId,
                    adminId: targetUserId,
                    userName: userName,
                    orderId: orderId,
                });
                if (roomId) {
                    console.log("Auto opened/created chat room:", roomId);
                    setAutoSelectedRoomId(roomId);
                    setShowMobileChat(true);
                }
            } catch (err) {
                console.error("Error auto creating room from location state:", err);
            }
        };

        handleAutoCreate();
    }, [location.state, currentUserId]);

    // 2. Fetch messages inside selectedUser's "messages" subcollection
    useEffect(() => {
        const targetId = selectedUser?.id || selectedUser?._id;
        if (!targetId) {
            setMessages([]);
            return;
        }

        // Safely reference subcollection via parent DocumentReference doc()
        const userDocRef = doc(db, "chat-v2", String(targetId));
        const messagesRef = collection(userDocRef, "messages");

        let q;
        try {
            q = query(messagesRef, orderBy("created_at"));
        } catch (e) {
            q = query(messagesRef);
        }

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const msgs = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                }));

                // Sort messages manually by created_at / createdAt timestamp
                msgs.sort((a, b) => {
                    const getSecs = (item) => {
                        if (item.created_at?.seconds) return item.created_at.seconds;
                        if (item.createdAt?.seconds) return item.createdAt.seconds;
                        if (typeof item.created_at?.toDate === "function") return item.created_at.toDate().getTime() / 1000;
                        if (typeof item.createdAt?.toDate === "function") return item.createdAt.toDate().getTime() / 1000;
                        // Pending serverTimestamp → sort at end, not start
                        return Infinity;
                    };
                    return getSecs(a) - getSecs(b);
                });

                setMessages(msgs);
            },
            (error) => {
                console.error("Error listening to messages subcollection:", error);
            }
        );

        return () => unsubscribe();
    }, [selectedUser?.id, selectedUser?._id]); 
    
    // 3. Handle sending message
    const handleSendMessage = async (text) => {
        const targetId = selectedUser?.id || selectedUser?._id;
        if (!text.trim() || !targetId) return;

        try {
            const userDocRef = doc(db, "chat-v2", String(targetId));
            const messagesRef = collection(userDocRef, "messages");

            const isFirstMsg = messages.length === 0;
            const shouldSendAutomated = isFirstMsg;

            const newMsgData = {
                message: text,
                created_at: serverTimestamp(),
                sender_id: currentUserId || "me",
                seen_by: [currentUserId || "me"],
            };

            await addDoc(messagesRef, newMsgData);

            // Update last_msg in the parent chat-v2 document
            await updateDoc(userDocRef, {
                last_msg: {
                    message: text,
                    seen_by: [currentUserId || "me"],
                    created_at: serverTimestamp(),
                },
                ...(shouldSendAutomated ? { isautomatedmsg: true } : {}),
            });

            // If it's the first message in this chat room, send automated support response
            if (shouldSendAutomated) {
                const adminId = Array.isArray(selectedUser?.user_id)
                    ? selectedUser.user_id.find((id) => id !== currentUserId && id !== "me") || "admin_id"
                    : "admin_id";

                const automatedReplyText =
                    "Thank you for contacting the MarketToll Support Team. We have received your message, and one of our team members will reach out to you shortly to assist you. We appreciate your patience and look forward to helping you.";

                await addDoc(messagesRef, {
                    message: automatedReplyText,
                    sender_id: adminId,
                    seen_by: [adminId],
                    created_at: serverTimestamp(),
                });

                await updateDoc(userDocRef, {
                    last_msg: {
                        message: automatedReplyText,
                        seen_by: [adminId],
                        created_at: serverTimestamp(),
                    },
                    isautomatedmsg: true,
                });
            }

            // Send notification for text message
            const receiverId = Array.isArray(selectedUser?.user_id)
                ? selectedUser.user_id.find((id) => id !== currentUserId && id !== "me")
                : null;

            if (receiverId) {
                const token = user?.token || Cookies.get("token");
                await axios.post(
                    `${BASE_URL}/users/chat-message-notification/${receiverId}`,
                    {
                        title: "This is a chat message notification.",
                        attachments: [],
                        body: text,
                        messageBody: text,
                        senderName: user?.name || user?.userName || user?.first_name || "User",
                    },
                    {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : undefined,
                        },
                    }
                ).catch((err) => console.error("Error sending chat text notification:", err));
            }
        } catch (error) {
            console.error("Error sending message to chat-v2:", error);
        }
    };

    // 4. Handle uploading and sending image attachments
    const handleSendImage = async (files) => {
        const targetId = selectedUser?.id || selectedUser?._id;
        if (!files || files.length === 0 || !targetId) return;

        try {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append("attachments", file);
                formData.append("type", 'png');
            });

            const token = user?.token || Cookies.get("token");

            const response = await axios.post(
                `${BASE_URL}/users/upload-chat-attachments`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: token ? `Bearer ${token}` : undefined,
                    },
                }
            );

            // Extract image URLs from API response
            let imageUrls = [];
            const resData = response?.data;
            if (Array.isArray(resData?.data)) {
                imageUrls = resData.data;
            } else if (typeof resData?.data === "string") {
                imageUrls = [resData.data];
            } else if (Array.isArray(resData?.urls)) {
                imageUrls = resData.urls;
            } else if (Array.isArray(resData)) {
                imageUrls = resData;
            } else if (typeof resData?.url === "string") {
                imageUrls = [resData.url];
            }

            if (!imageUrls || imageUrls.length === 0) {
                console.error("No image URLs returned from upload API:", response.data);
                return;
            }

            // Create attachments array matching structure: [{ url, type: 'png' }]
            const attachments = imageUrls.map((url) => ({
                attachments: url,
                type: "png",
            }));

            const userDocRef = doc(db, "chat-v2", String(targetId));
            const messagesRef = collection(userDocRef, "messages");

            for (const url of imageUrls) {
                await addDoc(messagesRef, {
                    message: url,
                    contentType: "image",
                    created_at: serverTimestamp(),
                    sender_id: currentUserId || "me",
                    seen_by: [currentUserId || "me"],
                });
            }

            await updateDoc(userDocRef, {
                last_msg: {
                    message: "Photo",
                    seen_by: [currentUserId || "me"],
                    created_at: serverTimestamp(),
                },
            });

            // Determine receiverId from selectedUser.user_id array
            const receiverId = Array.isArray(selectedUser?.user_id)
                ? selectedUser.user_id.find((id) => id !== currentUserId && id !== "me")
                : null;

            // Send Chat Notification via API
            if (receiverId) {
                try {
                    await axios.post(
                        `${BASE_URL}/users/chat-message-notification/${receiverId}`,
                        {
                            title: "Sent a photo",
                            messageBody: "Sent a photo",
                            body: "Sent a photo",
                            attachments: attachments,
                            senderName: user?.name || user?.userName || user?.first_name || "User",
                        },
                        {
                            headers: {
                                Authorization: token ? `Bearer ${token}` : undefined,
                            },
                        }
                    );
                } catch (notifError) {
                    console.error("Error sending chat image notification:", notifError);
                }
            }
        } catch (error) {
            console.error("Error uploading & sending image to chat-v2:", error);
        }
    };

    return (
        <div className="py-4 lg:py-8 padding-x min-h-screen bg-[#F8F9FB] flex items-center justify-center">
            {/* Outer Card Container */}
            <div className="w-full max-w-[1320px] bg-white rounded-[24px] lg:rounded-[32px] p-4 lg:p-6 shadow-sm border border-gray-100 min-h-[82vh] h-auto lg:h-[82vh] flex flex-col overflow-hidden">
                <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full min-h-0 overflow-hidden">
                    {/* Left Sidebar */}
                    <div
                        className={`lg:col-span-4 h-full min-h-0 flex flex-col overflow-hidden ${showMobileChat ? "hidden lg:flex" : "flex"
                            }`}
                    >
                        <ChatSidebar
                            users={usersList}
                            selectedUser={selectedUser}
                            onSelectUser={handleSelectUser}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onCreateChat={handleCreateChat}
                            currentUserId={currentUserId}
                        />
                    </div>

                    {/* Right Main Chat Window */}
                    <div
                        className={`lg:col-span-8 h-full min-h-0 flex flex-col overflow-hidden ${showMobileChat ? "flex" : "hidden lg:flex"
                            }`}
                    >
                        <ChatWindow
                            selectedUser={selectedUser}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            onSendImage={handleSendImage}
                            currentUserId={currentUserId}
                            onBackMobile={() => setShowMobileChat(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatV2;