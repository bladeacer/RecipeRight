import { useState } from "react";
import "../../themes/Chatbot.css";
import http from "../../http";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages([...messages, userMessage]);
        setInput("");

        setLoading(true);
        try {
            const response = await http.post("https://localhost:7004/api/chat/message", {
                message: input,
            });

            const aiMessage = {
                role: "ai",
                content: response.data.choices[0].message.content,
            };

            setMessages((prevMessages) => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`chatbot ${isOpen ? "open" : "closed"}`}>
            <button className="chat-toggle" onClick={toggleChat}>
                {isOpen ? "Close" : "Chat"}
            </button>
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-history">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.role === "user" ? "user" : "ai"}`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {loading && <div className="chat-loading">Typing...</div>}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
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

export default Chatbot;
