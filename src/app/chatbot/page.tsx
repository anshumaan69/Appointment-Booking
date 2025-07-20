"use client"

import { useState } from "react"

interface Message {
  sender: "user" | "bot"
  text: string
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I'm your AI medical assistant powered by Gemini Flash 1.5. I can provide fast, intelligent responses about appointments, our services, general health questions, and guide you to appropriate care. How can I assist you today?"
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage: Message = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await res.json()
      
      if (data.success && data.response) {
        const botMessage: Message = { sender: "bot", text: data.response }
        setMessages((prev) => [...prev, botMessage])
      } else {
        const errorMessage: Message = { 
          sender: "bot", 
          text: "I'm sorry, I'm having trouble right now. Please try again later or contact our office directly." 
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (err) {
      console.error("Chatbot error:", err)
      const errorMessage: Message = { 
        sender: "bot", 
        text: "I'm sorry, I'm having trouble right now. Please try again later or contact our office directly." 
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-xl border rounded-lg h-[600px] flex flex-col">
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold text-center">Medical Assistant Chatbot</h1>
            <p className="text-center text-blue-100 mt-2">
              Ask me about appointments, services, clinic hours, or general health questions
            </p>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t p-6">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about appointments, services, or health questions..."
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!input.trim() || loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Try asking: &ldquo;book appointment&rdquo;, &ldquo;clinic hours&rdquo;, &ldquo;what services&rdquo;, &ldquo;insurance&rdquo;, &ldquo;emergency&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
