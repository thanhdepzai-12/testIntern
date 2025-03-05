import React from "react";
import axios from "axios";
import moment from "moment";
import { useState, useRef, useEffect } from "react";
import '../Homepage/Homepage.css'
import { CaretUpOutlined, FireFilled, OpenAIOutlined } from "@ant-design/icons";
const Homepage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatRef = useRef(null);
    const [check,setCheck]=useState(false);
    const typingRef = useRef(""); 
  
    const sendMessage = async () => {
   
      if (!input.trim()) return;
      setCheck(true);
      const userMessage = { content: input, role: "user", create_at: Date.now() };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      await fetchBotResponse(input);
    };
  
    const fetchBotResponse = async (userInput) => { 
      try {
    
        const response = await fetch(
          "https://api.coze.com/v3/chat?conversation_id=7478183266101657607",
          {
            method: "POST",
            headers: {
              Authorization:
                "Bearer pat_hZrgsaRObvrRnCbkgK46q1ARKcT1F9a6uhqH3hwkiaUxKYydMRkkdif7MRzvHzkp",
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
        setMessages((prev) => [
          ...prev,
          { content: "", role: "bot", create_at: Date.now() },
        ]);
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          const text = decoder.decode(value, { stream: true });
          const match = text.match(/"content":"(.*?)"/);
          if (match) {
            botReply += match[1];
            typingRef.current = botReply; 
          }
        }
  
        typeEffect(botReply);
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      }
    };
  
    const typeEffect = (fullText) => {
      let index = 0;
      const typingSpeed = 50;
      typingRef.current = "";
  
      const interval = setInterval(() => {
        if (index < fullText.length) {
          typingRef.current += fullText[index];
          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1].content =
              typingRef.current;
            return updatedMessages;
          });
          index++;
          
        } else {
          clearInterval(interval);
        }
      }, typingSpeed);
    };

    useEffect(() => {
      const timeout = setTimeout(() => {
        chatRef.current?.scrollIntoView({ behavior: "smooth" });
   
      }, 100);
  
      return () => {
        clearTimeout(timeout)
      };
    }, [messages]);
  return (
    <div>
      <div className="container d-flex flex-column vh-100 p-4">
        {messages && messages.length > 0 ?
        <div className="flex-grow-1 overflow-auto mb-3 ">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`alert-${
                msg.role === "user"
                  ? "user"
                  : "assisstant"
              }`}
            >
                <div className="detail">
                    <div className="detail-content">
              {msg.content}
              </div>
              <div className="time-created">
              <p>{moment(msg.create_at).format("DD/MM/YYYY HH:mm:ss")}</p>
            
              </div>
              </div>
      
            </div>
          ))}
          <div ref={chatRef} />
        </div>
        :
        <div className="d-flex justify-content-center align-item-center flex-grow-1 mb-3">
          <OpenAIOutlined style={{fontSize:"20rem"}} />
        </div>
}
        <div className="input-group d-flex align-items-center">
            <div className="main-input">
          <input
            type="text"
            className="form-control"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          </div>
          <button className="btn-answer" onClick={sendMessage}>
            {check ? 
            <FireFilled style={{color:"white"}} />
            :
          <CaretUpOutlined style={{color:"white"}} />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
