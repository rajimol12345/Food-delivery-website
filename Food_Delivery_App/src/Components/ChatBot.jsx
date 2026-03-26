import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { FaHeadset, FaPaperPlane, FaTimes, FaMinus } from 'react-icons/fa';
import './ChatBot.css';

const socket = io('http://localhost:5000');

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Get User ID from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token") || "guest_user"; 

  useEffect(() => {
    // Join chat room
    socket.emit('join_chat', userId);

    // Fetch chat history from backend
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/api/messages/history/${userId}`);
        if (res.data.length > 0) {
          setMessages(res.data);
        } else {
          setMessages([{ 
            role: 'admin', 
            message: 'Hello! How can we help you today?', 
            timestamp: new Date().toISOString() 
          }]);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();

    // Listen for incoming messages
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [userId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msgData = {
      senderId: userId,
      receiverId: "admin_master", // Send to admin
      message: input,
      role: 'user'
    };

    socket.emit('send_message', msgData);
    setMessages((prev) => [...prev, { ...msgData, timestamp: new Date().toISOString() }]);
    setInput('');
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen ? (
        <div className="chat-bubble" onClick={() => setIsOpen(true)}>
          <FaHeadset />
          <span className="bubble-text">Help</span>
        </div>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-info">
              <FaHeadset className="header-icon" />
              <div>
                <h4>Customer Support</h4>
                <span className="status-online">Online</span>
              </div>
            </div>
            <div className="header-actions">
              <FaMinus className="action-btn" onClick={() => setIsOpen(false)} />
              <FaTimes className="action-btn" onClick={() => setIsOpen(false)} />
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                <div className="message-content">
                  <p>{msg.message}</p>
                  <span className="msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={sendMessage}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
