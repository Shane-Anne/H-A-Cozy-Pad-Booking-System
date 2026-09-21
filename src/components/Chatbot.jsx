import React, { useState } from "react";

export default function Chatbot({ isOpen, onClose }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim() || isLoading) {
            return;
        }

        const userMessage = message.trim();

        setMessages((previous) => [
            ...previous,
            {
                sender: "user",
                text: userMessage,
            },
        ]);

        setMessage("");
        setIsLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        message: userMessage,
                        user: "guest-user",
                        conversation_id: conversationId,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to contact Dify."
                );
            }

            setConversationId(data.conversation_id || "");

            setMessages((previous) => [
                ...previous,
                {
                    sender: "bot",
                    text: data.answer,
                },
            ]);
        } catch (error) {
            console.error("Chatbot error:", error);

            setMessages((previous) => [
                ...previous,
                {
                    sender: "bot",
                    text:
                        error.message ||
                        "Sorry, I couldn't connect to the chatbot.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 h-[500px] bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col overflow-hidden z-50">

            {/* Header */}
            <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">
                        H&A Cozy Pad
                    </h3>

                    <p className="text-xs text-gray-300">
                        AI Assistant
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="text-white text-xl"
                    type="button"
                >
                    ×
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                    <div className="text-sm text-gray-500">
                        <p>
                            Hello! How can I help you with H&A Cozy Pad?
                        </p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={
                            msg.sender === "user"
                                ? "flex justify-end"
                                : "flex justify-start"
                        }
                    >
                        <div
                            className={
                                msg.sender === "user"
                                    ? "bg-gray-800 text-white px-3 py-2 rounded-xl max-w-[80%]"
                                    : "bg-gray-100 text-gray-800 px-3 py-2 rounded-xl max-w-[80%]"
                            }
                        >
                            <p className="text-sm">
                                {msg.text}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="text-sm text-gray-500">
                        H&A Cozy Pad is typing...
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t p-3 flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    placeholder="Ask me something..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
                />

                <button
                    onClick={sendMessage}
                    disabled={isLoading}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                    type="button"
                >
                    Send
                </button>
            </div>
        </div>
    );
}