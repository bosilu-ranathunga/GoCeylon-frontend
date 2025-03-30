import React from 'react';
import { useState } from "react";
import TopAppBar from '../../components/TopAppBar';
import BottomTabBar from '../../components/BottomTabBar';
import { FaPaperPlane } from 'react-icons/fa';

export default function AiGuide() {
    const [messages, setMessages] = useState([
        { role: "bot", text: "Hello! How can I assist you today?" },
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        const userMessage = { role: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");
        setTimeout(() => {
            const botResponse = { role: "bot", text: "I am still learning!" };
            setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <>
            <TopAppBar />
            <div className="container mx-auto p-6 mt-[4rem] bg-gray-50 min-h-screen">
                <div className="flex-1 overflow-y-auto space-y-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-lg w-fit max-w-[80%] ${msg.role === "user" ? "ml-auto bg-blue-500 text-white" : "bg-gray-200"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex bg-white p-4 w-full bottom-[5rem] fixed items-center justify-between">
                <input
                    className="flex-1 border border-gray-300 p-3 rounded-lg mr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-[#007a55] p-3 rounded-full text-white shadow-md transition-colors duration-200 ease-in-out"
                >
                    <FaPaperPlane className="text-xl" />
                </button>
            </div>
            <BottomTabBar />
        </>
    );
}
