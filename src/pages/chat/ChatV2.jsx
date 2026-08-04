import React, { useContext, useEffect, useState } from "react";
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
        if (orderId) {
            const orderQuery = query(
                chatRef,
                where("order_id", "==", orderId),
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
            const userIds = docSnap.data()?.user_id || [];
            return userIds.includes(adminId);
        });

        // Return existing room ID if found
        if (existingRoom) {
            console.log("Chat room already exists:", existingRoom.id);
            return existingRoom.id;
        }

        // Create a new chat room with ONLY [userId, adminId] in user_id array
        const newRoomData = {
            user_id: [userId, adminId],
            user_name: userName,
            order_id: orderId,
            chat_status: true,
            is_online: false,
            created_at: serverTimestamp(),
            last_msg: {
                message: initialMessage || "Chat started",
                seen_by: [userId],
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
        }

        return newRoomRef.id;
    } catch (error) {
        console.error("Error in createChatRoom:", error);
        throw error;
    }
};

const ChatV2 = () => {
    const { user } = useContext(AuthContext);
    const currentUserId = user?._id || user?.id || "";

    const [usersList, setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
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
        const buyerId = currentUserId || "buyer_id";
        const roomId = await createChatRoom({
            userId: buyerId,
            adminId: targetUserId || "admin_id",
            userName: userName,
            orderId: orderId,
            initialMessage: initialMessage,
        });
        return roomId;
    };

    // 1. Fetch chat rooms from "chat-v2" collection where "user_id" array contains user AND chat_status is true
    useEffect(() => {
        const targetId = currentUserId || "buyer_id";
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

                console.log(chats, "usersList==");
                setUsersList(chats);

                if (chats.length > 0) {
                    setSelectedUser((prev) => {
                        if (!prev) return chats[0];
                        const found = chats.find(
                            (c) => (c.id || c._id) === (prev.id || prev._id)
                        );
                        return found || chats[0];
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
    }, [currentUserId]);

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
                        return 0;
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
            });
        } catch (error) {
            console.error("Error sending message to chat-v2:", error);
        }
    };

    return (
        <div className="py-4 lg:py-8 padding-x min-h-screen bg-[#F8F9FB] flex items-center justify-center">
            {/* Outer Card Container */}
            <div className="w-full max-w-[1320px] bg-white rounded-[24px] lg:rounded-[32px] p-4 lg:p-6 shadow-sm border border-gray-100 min-h-[82vh] flex flex-col">
                <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">
                    {/* Left Sidebar */}
                    <div
                        className={`lg:col-span-4 h-full ${showMobileChat ? "hidden lg:block" : "block"
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
                        className={`lg:col-span-8 h-full flex flex-col ${showMobileChat ? "block" : "hidden lg:flex"
                            }`}
                    >
                        <ChatWindow
                            selectedUser={selectedUser}
                            messages={messages}
                            onSendMessage={handleSendMessage}
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