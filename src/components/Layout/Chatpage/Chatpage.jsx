import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import { CaretUpOutlined, FireFilled } from "@ant-design/icons";
import './Chatpage.css';

const Chatpage = () => {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // 👉 THÊM useNavigate

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [check, setCheck] = useState(false);
  const [hasSentFirstQuestion, setHasSentFirstQuestion] = useState(false);

  const chatRef = useRef(null);
  const typingRef = useRef("");

  useEffect(() => {
    console.log("Mounted ChatPage", {
      conversationId,
      firstQuestion: location.state?.firstQuestion,
    });

    if (!hasSentFirstQuestion && location.state?.firstQuestion) {
      console.log("Sending FIRST question:", location.state.firstQuestion);
      sendMessage(location.state.firstQuestion);
      setHasSentFirstQuestion(true);
    } else if (!location.state?.firstQuestion) {
      console.log("Fetching message list for conversation:", conversationId);
      fetchMessageList();
    }
  }, [conversationId, location.state?.firstQuestion, hasSentFirstQuestion]);

  const fetchMessageList = async () => {
    try {
      const response = await fetch(
        `https://api.coze.com/v1/conversation/message/list?conversation_id=${conversationId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer pat_hZrgsaRObvrRnCbkgK46q1ARKcT1F9a6uhqH3hwkiaUxKYydMRkkdif7MRzvHzkp",
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Fetched message list:", data);

      // 👉 Kiểm tra nếu không có dữ liệu hoặc mảng rỗng thì quay về HOME
      if (!data?.data || data.data.length === 0) {
        console.warn("Không có dữ liệu, quay lại homepage...");
        navigate("/"); // 👉 Điều hướng về trang chủ
        return;
      }

      const groupedMessages = [];

      for (let i = 0; i < data.data.length; i += 2) {
        if (data.data[i] && data.data[i + 1]) {
          groupedMessages.unshift(
            {
              content: data.data[i + 1].content,
              role: "user",
              create_at: Date.now(),
            },
            {
              content: data.data[i].content,
              role: "bot",
              create_at: Date.now(),
            }
          );
        }
      }

      setMessages(groupedMessages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tin nhắn:", error);
      navigate("/"); // 👉 Có lỗi cũng điều hướng về HOME luôn
    }
  };

  const sendMessage = async (message) => {
    const userInput = message || input;
    if (!userInput.trim()) return;
    setCheck(true);

    const userMessage = {
      content: userInput.replace(/\n/g, "\n\n"),
      role: "user",
      create_at: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    await fetchBotResponse(userInput);
  };

  const fetchBotResponse = async (userInput) => {
    try {
      setMessages((prev) => [
        ...prev,
        { content: "⏳ Đang xử lý...", role: "bot", create_at: Date.now() },
      ]);

      const response = await fetch(
        `https://api.coze.com/v3/chat?conversation_id=${conversationId}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer pat_hZrgsaRObvrRnCbkgK46q1ARKcT1F9a6uhqH3hwkiaUxKYydMRkkdif7MRzvHzkp",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bot_id: "7478180449194655762",
            user_id: "user8860709086",
            stream: true,
            auto_save_history: true,
            additional_messages: [
              {
                content: userInput,
                content_type: "text",
                role: "user",
                type: "question",
              },
            ],
          }),
        }
      );

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botReply = "";
      typingRef.current = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const match = text.match(/"content":"(.*?)"/);
        if (match) botReply += match[1];
      }

      typeEffect(botReply);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  const typeEffect = (fullText) => {
    let index = 0;
    const typingSpeed = 20;
    typingRef.current = "";

    setMessages((prev) => {
      const updatedMessages = [...prev];
      updatedMessages[updatedMessages.length - 1] = {
        content: "",
        role: "bot",
        create_at: Date.now(),
      };
      return updatedMessages;
    });

    const interval = setInterval(() => {
      if (index < fullText.length) {
        typingRef.current += fullText.slice(index, index + 4);
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1].content = typingRef.current;
          return updatedMessages;
        });
        index += 4;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  return (
    <div className="container d-flex flex-column vh-100 p-4">
      <div className="contain-content flex-grow-1 h-75 overflow-auto mb-3 px-3">
        {messages.map((msg, index) => (
          <div key={index} className={`alert-${msg.role === "user" ? "user" : "assisstant"}`}>
            <div className="detail">
              <div className="detail-content">
                {msg.content === "⏳ Đang xử lý..." ? (
                  <div className="typing-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <ReactMarkdown>
                    {msg.content
                      .replace(/\\n/g, "\n")
                      .replace(/\n{2,}/g, "\n\n")
                      .trim()}
                  </ReactMarkdown>
                )}
              </div>
              <div className="time-created">
                <p>{moment(msg.create_at).format("DD/MM/YYYY HH:mm:ss")}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatRef} />
      </div>

      <div className="input-group d-flex align-items-center">
        <input
          type="text"
          className="form-control main-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn-answer" onClick={() => sendMessage()}>
          {check ? (
            <FireFilled style={{ color: "white" }} />
          ) : (
            <CaretUpOutlined style={{ color: "white" }} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Chatpage;
