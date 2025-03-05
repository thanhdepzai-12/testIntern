import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '../Sidebar/Sidebar.css'
import { OpenAIOutlined } from "@ant-design/icons";
const Sidebar = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessageList = async () => {
    try {
      const response = await fetch(
        "https://api.coze.com/v1/conversation/message/list?conversation_id=7478183266101657607",
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer pat_hZrgsaRObvrRnCbkgK46q1ARKcT1F9a6uhqH3hwkiaUxKYydMRkkdif7MRzvHzkp",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dữ liệu API trả về:", data);
      setMessages(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tin nhắn:", error);
    }
  };
  useEffect(() => {
    fetchMessageList();
  }, []);

  const groupedMessages = [];
  for (let i = 0; i < messages.length; i += 2) {
    if (messages[i] && messages[i + 1]) {
      groupedMessages.push({
        question: messages[i + 1].content,
        answer: messages[i].content,
      });
    }
  }
  return (
    <div className="container mt-3">
      <h4 className="text-center"><OpenAIOutlined /> Danh sách tin nhắn</h4>
      <div className="list-group">
        {groupedMessages.length === 0 ? (
          <p className="text-center">Không có tin nhắn nào.</p>
        ) : (
          groupedMessages.map((msg, index) => (
            <div key={index} className="list-group-item">
              <p>
                <strong>Bạn:</strong> {msg.question}
              </p>
              <p className="text-secondary"
                title={msg.answer}
              >
                <strong>Bot:</strong> {msg.answer}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
