import React, { useState } from 'react';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    

    console.log("Input Text:", inputText)
    console.log("API Key:", API_KEY)
    // Add user message to the chat
    setMessages([...messages, { role: 'user', content: inputText }]);
    setInputText('');

    // Generate AI response
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          messages: [{ role: 'user', content: inputText }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      // Add AI response to the chat
      const aiMessage = data.choices[0].message.content;
      setMessages([...messages, { role: 'ai', content: aiMessage }]);
      console.log("AI Message:", aiMessage)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gray-200 h-screen flex flex-col justify-between p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div className={`p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit} className="mt-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 rounded-lg bg-white text-gray-800"
          placeholder="Enter your message..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 rounded-lg bg-blue-500 text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
