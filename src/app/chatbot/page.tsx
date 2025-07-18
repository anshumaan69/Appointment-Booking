"use client";
import { useState } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      
      if (res.ok) {
        const botMessage: Message = { sender: "bot", text: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = { 
          sender: "bot", 
          text: `Error: ${data.error || "Failed to get response"}` 
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      const errorMessage: Message = { 
        sender: "bot", 
        text: "Network error. Please try again." 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="h-96 overflow-y-auto border rounded p-4 shadow bg-white">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={`${msg.sender === "user" ? "text-blue-600" : "text-green-600"}`}>
              <b>{msg.sender === "user" ? "You" : "Bot"}:</b> {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          className="flex-grow border p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask something..."
          disabled={loading}
        />
        <button 
          onClick={sendMessage} 
          disabled={loading || !input.trim()}
          className="bg-blue-500 text-white p-2 rounded-r disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
