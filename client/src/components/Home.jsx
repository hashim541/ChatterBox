import { useEffect, useState, useRef } from "react"
import UserConversation from "./userConversation/UserConversations"
import MessageUser from "./messageUser/MessageUser"


const Home = ({isUserAuthenticated,userLoginData,URL})=>{
    const [userFriendList,setUserFriendList]=useState([])
    const [loadDashboard,setLoadDashboard]=useState(false)
    const [chatUser,setChatUser]=useState(null)
    const [room,setRoom]=useState(null)
    const [toggleMsg,setToggleMsg]=useState(false)


    const getUserData = async(uid)=>{
        const path='/usersData'
        const options={
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userID:uid})
        }
        try {
            const response = await fetch(URL+path,options);
            const data = await response.json();
            const newData=data.userConversations.map(d=>{
                return d.uid
            })
            setUserFriendList(newData)
            setLoadDashboard(true)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        if(isUserAuthenticated){
            getUserData(userLoginData.userID)
        }
    },[isUserAuthenticated])
    useEffect(()=>{
        if(chatUser){
            chatUser.userConversations.map(d =>{
                if(d.uid === userLoginData.userID){
                    setRoom(d.room)
                }
            })
        }
    },[chatUser])
    if(loadDashboard){
        return(
            <div className="dashboard">
                <UserConversation 
                    userLoginData={userLoginData}
                    userFriendList={userFriendList}
                    setUserFriendList={setUserFriendList}
                    URL={URL}
                    setChatUser={setChatUser}
                    setToggleMsg={setToggleMsg}
                />
                {chatUser && <MessageUser URL={URL} userLoginData={userLoginData} chatUser={chatUser} room={room} setToggleMsg={setToggleMsg} toggleMsg={toggleMsg} />}
            </div>
        )
    }
}
export default Home