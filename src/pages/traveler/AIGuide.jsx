import React from 'react';
import { useState } from "react";
import TopAppBar from '../../components/TopAppBar';
import BottomTabBar from '../../components/BottomTabBar';

export default function AIGuide() {
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
            <div className="flex flex-col bg-gray-100 border h-screen w-full max-w-md mx-auto">
                <div className="flex bg-blue-600 p-4 shadow-md text-white font-semibold items-center">
                    AI AIGuide
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-2">
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
                <div className="flex bg-white border-t p-4 w-full bottom-20 fixed items-center">
                    <input
                        className="flex-1 border p-2 rounded-lg mr-2"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button onClick={handleSend} className="bg-blue-500 p-2 rounded-lg text-white">
                        send
                    </button>
                </div>
            </div>
            <BottomTabBar />
        </>
    );
}
