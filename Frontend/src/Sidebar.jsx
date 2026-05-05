import { useContext, useEffect, useState } from "react";
import "./Sidebar.css";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";

function Sidebar(){

    const {allThreads, setAllThreads, currThreadId, reply,setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);
    const[editingThreadId, setEditingThreadId] = useState(null);
    const[editingTitle, setEditingTitle] = useState("");

    const getAllThreads = async() => {
        const token = localStorage.getItem("token");
        try{
            const response = await fetch("http://localhost:8080/api/thread", {
                headers: {"Authorization": `Bearer ${token}`}
            });
            const res =await response.json();
            if(!Array.isArray(res)) return;
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title })); 
           // console.log(filteredData);
            setAllThreads(filteredData);
        }catch(err){
            console.log(err);
        }
    };
    useEffect(() => {
        getAllThreads();

    },[currThreadId, reply]);


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async(newThreadId) => {
        const token = localStorage.getItem("token");
        setCurrThreadId(newThreadId);

        try{
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
                headers: { "Authorization": `Bearer ${token}`}
            });
            const res = await response.json();

            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        }catch(err){
            console.log(err);
        }
    }

    const deleteThread = async(threadId) => {
        const token = localStorage.getItem("token");
        try{
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE", headers:{"Authorization": `Bearer ${token}`}});
            const res = await response.json();
            console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId != threadId));

            if(threadId === currThreadId){
                createNewChat();
            }
        }catch(err){
            console.log(err);       }
    }


    const startEditing = (e, thread) => {
        e.stopPropagation();
        setEditingThreadId(thread.threadId);
        setEditingTitle(thread.title);
    }

   const saveRename = async(threadId, title) => {  // 👈 accept title as param
    if(!title.trim()) return cancelEditing();
    const token = localStorage.getItem("token");

    try{
        await fetch(`http://localhost:8080/api/thread/${threadId}/rename`, {
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({title: title})  // 👈 use param not state
        });
        setAllThreads(prev => prev.map(t => t.threadId === threadId ? {...t, title: title}: t));
    }catch(err){
        console.log(err);
    }
    cancelEditing();
}

    const cancelEditing = () => {
        setEditingThreadId(null);
        setEditingTitle("");
    }


    return(
        <section className="sidebar">
         <button onClick={createNewChat}>
            <img src ="src/assets/blacklogo.png" alt ="gpt logo" className="logo"></img>
           <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                       <li key={idx}
    onClick={() => changeThread(thread.threadId)}
    onDoubleClick={(e) => startEditing(e, thread)}  // 👈 add this
    className={thread.threadId === currThreadId ? "highlighted" : " "}
>
    {editingThreadId === thread.threadId ? (   // 👈 add this block
        <input
            className="renameInput"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === "Enter") saveRename(thread.threadId, editingTitle);
                if(e.key === "Escape") cancelEditing();
            }}
            onBlur={() => saveRename(thread.threadId, editingTitle)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
        />
    ) : (
        <>
            {thread.title}
            <i className="fa-solid fa-trash" onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
            }}></i>
        </>
    )}
</li>

                      
                    ))
                }
            </ul>

            <div className="sign">
                <p>By Priya Pandey &hearts;</p>
                </div>            
        </section>
    )
}

export default Sidebar;