import { useEffect, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";
import { format } from "timeago.js";
function App() {
  const scrollRef = useRef();
  const socket = io("http://localhost:9000");
  const [message, setMessage] = useState("");
  const [id, setId] = useState(uuid());
  const [isMessage, setIsMessage] = useState(false);
  const [room, setRoom] = useState("");
  const [clicked, setClicked] = useState(false);
  const handleJoin = (e) => {
    socket.emit("join_room", room);
    alert(`Welcome to the room ${room} `);
  }; 

  const handleNotification = (e) => {

   socket.emit("notification", {isClicked:true, room})
  }

  const messageHandler = () => {
    socket.emit("send_message", {
      message,
      own: true,
      room,
      id,
      date: new Date(),
    });
    setMessage("");
  };
  const [messageArray, setMessageArray] = useState([]);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageArray((prev) => [...prev, data]);
      setIsMessage(true);
    });
  }, [socket]);
  
  useEffect(() => {
    socket.on("receive_notification", notify => {
      setClicked(Boolean(notify?.isClicked));
      
    })
  }, [socket])
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);



  return (
    <div className="App">
      <div className="Message_title">
        <div>
          <h1 onClick={handleNotification}>+</h1>
        </div>
          
          <div >
          <div className="notification">
       <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="" style={{
            height : "1.5rem"
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
          />
        </svg>
         
       {clicked &&  <div className="badge">1</div>}
       </div>
          </div>
         
        <input
          placeholder="join room"
          onChange={(e) => setRoom(e.target.value)}
          type={"text"}
        />
        <button type="button" onClick={handleJoin}>
          Join
        </button>
        <h1>Messages</h1>
        <hr />
      </div>
      {!isMessage && <h1 className="starting">Start a conversation..</h1>}
      <div className="msg_box">
        {messageArray?.map((message, index) => {

          return (
            <div
              ref={scrollRef}
              key={index}
              className={message.id === id ? "own" : "others"}
            >
              <p> {message.message}</p>
              <h6> {format(message.date)}</h6>
            </div>
          );
        })}
      </div>
      <div className="message__area">
        <div>
          {" "}
          <input
            placeholder="Write message.."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={messageHandler}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
