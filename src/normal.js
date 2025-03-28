import React, { useState } from 'react';
import './App.css';

const OpenRouterChat = () => {
  const [userMessage, setUserMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleApiCall = async () => {
    if (!userMessage.trim()) return;

    setIsLoading(true); // Set loading state to true while making the API call
    setMessages([...messages, { role: 'user', content: userMessage }]); // Add user message to the chat

    try {
      const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer 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`,  // Directly using the API key here
          "HTTP-Referer": "https://example.com",  // Fallback URL
          "X-Title": "My Chat App",  // Fallback app title
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat-v3-0324:free",
          "messages": [
            {
              "role": "user",
              "content": userMessage
            }
          ]
        })
      });

      // Check if response is ok, if not, throw an error
      if (!apiResponse.ok) {
        throw new Error(`API call failed with status: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      const botMessage = data.choices[0]?.message?.content || 'No response received';

      // Add bot response to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'bot', content: botMessage }
      ]);
    } catch (error) {
      console.error('API call failed:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'bot', content: 'Failed to get a response' }
      ]);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '80vh',
      justifyContent: 'space-between'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333'
      }}>
        OpenRouter Chat
      </h2>

      <div style={{
        flexGrow: 1,
        overflowY: 'auto',
        paddingRight: '10px',
        paddingLeft: '10px',
        marginBottom: '10px'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '10px',
            textAlign: msg.role === 'user' ? 'right' : 'left'
          }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '80%',
              padding: '10px',
              backgroundColor: msg.role === 'user' ? '#007bff' : '#f4f4f4',
              color: msg.role === 'user' ? 'white' : 'black',
              borderRadius: '20px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              wordWrap: 'break-word'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        <input 
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Enter your message..."
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
        />

        <button 
          onClick={handleApiCall} 
          disabled={isLoading || !userMessage.trim()}
          style={{
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </div>
  );
};

export default OpenRouterChat;
