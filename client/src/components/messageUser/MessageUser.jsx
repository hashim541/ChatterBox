import MUNavbar from "./MUNavbar"
import SendMessage from "./SendMessage"
import MessageBox from "./MessageBox"
import {useEffect, useRef, useState} from 'react'
import socket from "../../socket"

const MessageUser = ({URL,userLoginData,chatUser,room,setToggleMsg,toggleMsg})=>{
    const [userMessages,setUserMessages]=useState([])
    const messageRef=useRef()
    const dummyRef = useRef()
    const handelSendMessage=(e)=>{
        e.preventDefault()
        if(messageRef.current.value !== ''){
            const messageData = {
                currRoom:room,
                data:{
                    from:userLoginData.userID,
                    msg:messageRef.current.value
                }
            }
            messageRef.current.value = ''
            socket.emit('listenMessage',messageData)
            setUserMessages((prevMsg)=>[...prevMsg,messageData.data])
            putUserMessage(messageData);
            dummyRef.current.scrollIntoView({behavoir:"smooth"})
            messageRef.current.focus();
        }else{
            messageRef.current.focus();
        }
    }
    const putUserMessage = async (messageData,)=>{
        const path = '/setMessages'
        const options={
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData)
        }
        try {
            const response = await fetch(URL+path,options)
            // const data = await response.json()
        } catch (error) {
            console.log(error);
        }
    }
    const getMessages =async(room)=>{
        const path = '/getMessages'
        const options={
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currRoom:room})
        }
        try {
            const response = await fetch(URL+path,options)
            const data = await response.json()
            setUserMessages(data);
            dummyRef.current.scrollIntoView({behavoir:"smooth"})
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        if(room){
            getMessages(room)
            socket.on('reloadMessage',data =>{
                if(data.currRoom === room && data.data.from === chatUser.userID){
                    setUserMessages((prevMsg)=>[...prevMsg,data.data])
                }
            })
        }
    },[room])
    return(
        <div className={toggleMsg ? "message-user top-0":"message-user"}>
            <MUNavbar userData={chatUser} setToggleMsg={setToggleMsg}/>
            <MessageBox userMessages={userMessages} userLoginData={userLoginData} reference={dummyRef}/>
            <SendMessage refe={messageRef} handelSendMessage={handelSendMessage}/>
        </div>
    )
    
}
export default MessageUser