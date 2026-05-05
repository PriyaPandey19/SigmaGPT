import { useState } from 'react'
import './App.css'
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import { MyContext } from './MyContext.jsx';
import {v1 as uuidv1} from "uuid";


function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const[prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const[allThreads, setAllThreads] = useState([]);
  const[isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const[showRegister, setShowRegister] = useState(false);


  const providerValues = {
   prompt, setPrompt,
   reply, setReply,
   currThreadId, setCurrThreadId,
   newChat, setNewChat,
   prevChats, setPrevChats,
   allThreads, setAllThreads
  }

  if(!isLoggedIn){
    return showRegister
    ? <Register goToLogin={() => setShowRegister(false)} />
    : <Login onLogin={() => setIsLoggedIn(true)} goToRegister={() => setShowRegister(true)}/>
  }


  return (
    <>
      <div className='app'>
        <MyContext.Provider value={providerValues}>
          <Sidebar />
          <ChatWindow onLogout ={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          setIsLoggedIn(false);
          setReply(null);
  setPrevChats([]);
  setAllThreads([]);
  setCurrThreadId(uuidv1());
  setNewChat(true);
          }} />
        </MyContext.Provider>
      </div>
    </>
  )
}

export default App
