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
            <div className="flex flex-col h-screen w-full max-w-md mx-auto border bg-gray-100">
                <div className="flex items-center p-4 bg-blue-600 text-white font-semibold shadow-md">
                    AI AIGuide
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
                <div className="flex items-center p-4 border-t bg-white">
                    <input
                        className="flex-1 mr-2 p-2 border rounded-lg"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded-lg">
                        send
                    </button>
                </div>
            </div>
            <BottomTabBar />
        </>
    );
}
