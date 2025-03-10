import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from './components/Layout/HomePage/HomePage';
import ChatPage from './components/Layout/ChatPage/ChatPage';



const App = () => (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat/:conversationId" element={<ChatPage />} />
    </Routes>
);

export default App;