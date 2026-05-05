import React, { useContext, useEffect, useState, useRef } from 'react'
import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from './MyContext';
import {ScaleLoader} from "react-spinners";

function ChatWindow({onLogout}) {

  const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const[isOpen, setIsOpen] = useState(false);
  const abortControllerRef = useRef(null);

  const themes = ["dark","light","ocean","forest","sunset","purple", "arctic","rose"];
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

   useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

   const toggleTheme = () => {
    setTheme(prev => {
      const idx = themes.indexOf(prev);
      return themes[(idx + 1) % themes.length];
    });
   };

  const getReply = async() => {
    setLoading(true);
    setNewChat(false);
    const token = localStorage.getItem("token");

    abortControllerRef.current = new AbortController();

    console.log("message", prompt, "threadId", currThreadId )
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId
      }),
      signal: abortControllerRef.current.signal
    };

    try{
     const response =  await fetch("http://localhost:8080/api/chat", options);
     const res = await response.json();

     console.log(res);
     setReply(res.reply);
    }catch(err){
      console.log(err); 
    }
    setLoading(false);
  }

  useEffect(()=> {
    if(prompt && reply){
      if(prompt && reply){
        setPrevChats(prevChats => (
          [...prevChats, {
            role: "user",
            content: prompt
          },{
            role: "assistant",
            content: reply
          }]
        ))
      }
    }
     setPrompt("");
  },[reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen)
  }

  return (
  <div className='chatWindow'>
    <div className='navbar'>
      <span>SigmaGPT<i className="fa-solid fa-angle-down"></i></span>

      <div className='navRight'>
        <button className='themeToggle' onClick={toggleTheme} title={theme}>
            {theme === "dark" ? <i className="fa-solid fa-moon"></i>
             : <i className="fa-solid fa-palette"></i>}
          </button>


      

      <div className='userIconDiv' onClick={handleProfileClick}>
        <span className='userIcon'><i className="fa-solid fa-user"></i></span>
      </div>
    </div>
    </div>

    {
      isOpen && 
      <div className='dropDown'>
        
         <div className='dropDownItem'><i class="fa-solid fa-gear"></i>Setting</div>
         <div className='dropDownItem'><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan</div>
          <div className='dropDownItem' onClick={onLogout}><i class="fa-solid fa-arrow-right-from-bracket"></i>Log out</div>
        </div>
    }


    <Chat></Chat>

    <ScaleLoader color='#fff' loading={loading}></ScaleLoader>

    <div className='chatInput'>
      <div className='inputBox'>
        <input placeholder='Ask Anything' value={prompt} onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" ? getReply(): ''}
        >
        </input>

        <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>

      </div>
      <p className='info'>
        SigmaGPT can make mistakes. Check important info. See cookie Preferences.
      </p>

    </div>
    
  </div>
  )
}

export default ChatWindow