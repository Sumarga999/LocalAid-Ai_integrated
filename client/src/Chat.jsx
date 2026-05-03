import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// Connect to your backend
const socket = io.connect("http://localhost:5000");

function Chat() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // Get current logged-in user details from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = user?._id || user?.userId || user?.id;

  useEffect(() => {
    if (!currentUserId) {
      console.error("User not logged in or user ID missing.");
      return;
    }

    // 1. Join the Socket.io room for this specific task
    socket.emit("join_room", taskId);

    // 2. Fetch Chat History from MongoDB
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/messages/${taskId}`);
        if (!response.ok) throw new Error("Failed to fetch history");
        const history = await response.json();
        setMessages(history);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchHistory();

    // 3. Listen for incoming real-time messages
    const receiveMessageHandler = (data) => {
      setMessages((prev) => [...prev, data]);
    };
    socket.on("receive_message", receiveMessageHandler);

    // Cleanup when user leaves the chat page
    return () => {
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [taskId, currentUserId]);

  // Auto-scroll to bottom inside the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentUserId) return;

    // Create the message object
    const messageData = {
      taskId: taskId,
      senderId: currentUserId,
      text: inputMessage,
      sender: { _id: currentUserId, name: user?.name || "Me" },
      createdAt: new Date().toISOString()
    };

    // Emit to backend via socket
    socket.emit("send_message", messageData);

    // Immediately show on my screen
    setMessages((prev) => [...prev, messageData]);
    setInputMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-plus-jakarta">
      
      {/* Main Desktop Container */}
      <div className="w-full max-w-6xl h-[85vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden border border-slate-200">
        
        {/* --- LEFT SIDEBAR --- */}
        <div className="hidden md:flex w-1/3 lg:w-1/4 bg-slate-50 border-r border-slate-200 flex-col">
          
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-[#2e7d32] transition-colors font-bold"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Task
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="p-6 flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Task Information</h3>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-[#2e7d32] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">work</span>
                </div>
                <div className="font-bold text-slate-800">Task Collaboration</div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                This is a private, real-time discussion room between the requester and the volunteer for this specific task.
              </p>
            </div>

            <div className="mt-6">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Security</h3>
               <div className="flex items-center gap-2 text-sm text-slate-600">
                 <span className="material-symbols-outlined text-slate-400 text-lg">lock</span>
                 End-to-end communication
               </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT CHAT AREA --- */}
        <div className="flex-1 flex flex-col bg-white relative">
          
          {/* Mobile Back Button (Only shows on small screens) */}
          <button 
            onClick={() => navigate(-1)}
            className="md:hidden absolute top-5 left-4 z-20 text-slate-600 hover:text-[#2e7d32] transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          {/* Chat Header */}
          <div className="px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10 shadow-sm">
            <div className="flex items-center gap-4 pl-8 md:pl-0">
              <div className="w-12 h-12 rounded-full bg-[#2e7d32] text-white flex items-center justify-center font-bold text-xl shadow-md">
                <span className="material-symbols-outlined">forum</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Live Discussion</h2>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  Connected
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={chatContainerRef} 
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/50 flex flex-col scroll-smooth"
          >
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">waving_hand</span>
                <p className="font-medium text-slate-500">No messages yet.</p>
                <p className="text-sm">Say hello to start coordinating!</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const msgSenderId = msg.sender?._id || msg.senderId || msg.sender;
                const isMe = msgSenderId === currentUserId;

                return (
                  <div 
                    key={msg._id || msg.id || index} 
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {!isMe && (
                      <span className="text-xs text-slate-400 mb-1 ml-3 font-bold tracking-wide">
                        {msg.sender?.name || 'User'}
                      </span>
                    )}
                    <div 
                      className={`px-6 py-3.5 max-w-[85%] md:max-w-[70%] text-[15px] leading-relaxed shadow-sm ${
                        isMe 
                          ? 'bg-[#2e7d32] text-white rounded-2xl rounded-tr-sm' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm' 
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-white border-t border-slate-100">
            <form 
              onSubmit={handleSendMessage} 
              className="flex items-center gap-4 max-w-5xl mx-auto"
            >
              <div className="flex-1 flex items-center bg-slate-100 rounded-full px-6 py-3.5 border border-slate-200 focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-50 transition-all">
                <input 
                  type="text" 
                  placeholder="Type your message here..." 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
                />
              </div>
              <button 
                type="submit" 
                disabled={!inputMessage.trim()}
                className="w-14 h-14 rounded-full bg-[#2e7d32] text-white flex items-center justify-center hover:bg-[#1b5e20] disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined font-bold text-2xl">send</span>
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Chat;