import React, { useState } from 'react';
import './Chatapi.css';
import ChatHistory from './ChatHistory';

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const fetchDeepSeekResponse = async (message) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [{ role: 'user', content: message }]
        })
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No response from DeepSeek';
    } catch (error) {
      console.error('DeepSeek API call failed:', error);
      return 'DeepSeek API error';
    }
  };

  const fetchQwenResponse = async (message) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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", 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "qwen/qwen2.5-vl-3b-instruct:free",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: message }
              ]
            }
          ]
        })
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.choices[0]?.message?.content || "No response from Qwen";
    } catch (error) {
      console.error("Qwen API call failed:", error);
      return "Qwen API error";
    }
  };
  

 

  const handleApiCall = async () => {
    if (!userMessage.trim()) return;
  
    setIsLoading(true);
    setMessages(prevMessages => [...prevMessages, { role: 'user', content: userMessage }]);
  
    const deepSeekResponse = await fetchDeepSeekResponse(userMessage);
    const qwenResponse = await fetchQwenResponse(userMessage);
  
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'bot', content: `DeepSeek: ${deepSeekResponse}` },
      { role: 'bot', content: `Qwen: ${qwenResponse}` }
    ]);
  
    setIsLoading(false);
  };
  

  return (
    <div className="chatbot-container">
      <div className="chat-history-container">
        <ChatHistory messages={messages} onSelectMessage={setUserMessage} />
      </div>

      <div className="chat-box-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <span>{msg.content}</span>
            </div>
          ))}
        </div>

        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
        />

        <button onClick={handleApiCall} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
