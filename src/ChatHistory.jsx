// ChatHistory.jsx
import React from 'react';

const ChatHistory = ({ messages, setMessages, onSelectMessage }) => {
  return (
    <div className="chat-history">
      <h3>Search History</h3>
      <ul>
        {messages.map((msg, index) => (
          <li
            key={index}
            onClick={() => onSelectMessage(msg.content)}
            className="history-item"
          >
            {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;
