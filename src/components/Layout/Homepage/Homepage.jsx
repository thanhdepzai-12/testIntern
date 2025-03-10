import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretUpOutlined, FireFilled } from "@ant-design/icons";
import ImageLogo from '../../../assets/Photo/ChatGPT-Logo.png'
const Homepage = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartChat = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      // Tạo conversation mới
      const response = await fetch("https://api.coze.com/v1/conversation/create", {
        method: "POST",
        headers: {
          Authorization: "Bearer pat_hZrgsaRObvrRnCbkgK46q1ARKcT1F9a6uhqH3hwkiaUxKYydMRkkdif7MRzvHzkp",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
     
      const conversationId = data.data?.last_section_id;
      setInput("");
      if (!conversationId) throw new Error("Không lấy được conversation_id");

      // Chuyển sang trang chat với conversationId
      navigate(`/chat/${conversationId}`, { state: { firstQuestion: input } });
    } catch (error) {
      console.error("Lỗi tạo cuộc trò chuyện:", error);
      alert("Có lỗi xảy ra khi tạo cuộc trò chuyện!");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="container d-flex flex-column vh-100 p-4 justify-content-center align-items-center text-center">
  <img
    src={ImageLogo}
    alt="Logo"
    className="img-fluid"
    style={{ maxWidth: "300px", width: "80%", height: "auto", marginBottom: "1rem" }}
  />

  <h2 className="mx-3 fs-4 fs-md-3">Nhập câu hỏi để bắt đầu cuộc trò chuyện!</h2>

  <div className="input-group mt-4 w-100 px-2 px-md-0" style={{ maxWidth: "500px" }}>
    <input
      type="text"
      className="form-control main-input"
      placeholder="Nhập câu hỏi đầu tiên..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleStartChat()}
      style={{ fontSize: "1rem" }}
    />
    <button
      className="btn-answer d-flex justify-content-center align-items-center mx-3"
      onClick={handleStartChat}
      disabled={loading || !input.trim()}
    >
      {loading ? (
        <FireFilled style={{ color: "white"}} />
      ) : (
        <CaretUpOutlined style={{ color: "white"}} />
      )}
    </button>
  </div>
</div>

  );
};

export default Homepage;