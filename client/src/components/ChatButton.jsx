import React, { useState, useRef } from "react";
import "../themes/ChatButton.css";


const ChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 300, height: 400 });
    const chatWindowRef = useRef(null);
    const isResizing = useRef(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: "user", text: input }]);
        setInput("");

        setLoading(true);
        try {
            const response = await fetch("https://localhost:7004/api/Chat/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch AI response.");
            }

            const data = await response.json();
            const aiResponseText = data.choices[0]?.message?.content || "AI response unavailable.";

            setMessages([...messages, { sender: "user", text: input }, { sender: "ai", text: aiResponseText }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages([...messages, { sender: "ai", text: "An error occurred. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !loading) {
            sendMessage();
            e.preventDefault();
        }
    };

    const startResizing = (e) => {
        e.preventDefault();
        isResizing.current = true;
        window.addEventListener("mousemove", handleResize);
        window.addEventListener("mouseup", stopResizing);
    };

    const handleResize = (e) => {
        if (!isResizing.current) return;
        const chatWindow = chatWindowRef.current;
    
        if (chatWindow) {
            // Set min and max size limits
            const minWidth = 300;  // Minimum width (px)
            const maxWidth = 600;  // Maximum width (px)
            const minHeight = 300; // Minimum height (px)
            const maxHeight = 700; // Maximum height (px)
    
            // Calculate new dimensions
            let newWidth = chatWindow.offsetWidth - (e.clientX - chatWindow.offsetLeft);
            let newHeight = chatWindow.offsetHeight - (e.clientY - chatWindow.offsetTop);
    
            // Enforce min/max width
            if (newWidth < minWidth) newWidth = minWidth;
            if (newWidth > maxWidth) newWidth = maxWidth;
    
            // Enforce min/max height
            if (newHeight < minHeight) newHeight = minHeight;
            if (newHeight > maxHeight) newHeight = maxHeight;
    
            setDimensions({ width: newWidth, height: newHeight });
        }
    };

    const stopResizing = () => {
        isResizing.current = false;
        window.removeEventListener("mousemove", handleResize);
        window.removeEventListener("mouseup", stopResizing);
    };

    return (
        <div className="chat-container">
            <button className="chat-toggle" onClick={toggleChat}>
                {isOpen ? "Close Chat" : "Chat"}
            </button>
            {isOpen && (
                <div
                    ref={chatWindowRef}
                    className="chat-window"
                    style={{ width: dimensions.width, height: dimensions.height }}
                >
                    <div className="chat-resize-handle" onMouseDown={startResizing} />
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>
                                {typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text)}
                            </div>
                        ))}
                        {loading && <div className="chat-loading">AI is typing...</div>}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage} disabled={loading}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatButton;
