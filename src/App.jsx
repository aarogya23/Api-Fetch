import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login'; // Login component
import Chatbot from './Chatapi'; // Chatbot component

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define your routes here */}
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chatbot />} />
          {/* Optionally, add a redirect to /login */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
