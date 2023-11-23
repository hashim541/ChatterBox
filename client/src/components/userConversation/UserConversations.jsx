import SearchUser from './SearchUser'
import EachFriend from './EachFriend'
import socket from '../../socket'
import { useEffect, useState } from 'react'

const UserConversation = ({userLoginData,userFriendList,setUserFriendList,URL,setChatUser,setToggleMsg})=>{
    const [onlineUsers,setOnlineUsers]=useState([])
    const [offlineUsers,setOfflineUsers]=useState([])
    const reloadFriendList = async (d,URL)=>{
        const path='/usersData'
        const options={
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userID:d})
        }
        try {
            const response = await fetch(URL+path,options);
            const data = await response.json()
            const newData=data.userConversations.map(d=>{
                return d.uid
            })
            setUserFriendList(newData)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        const userSocketData={
            socketID:socket.id,
            userID:userLoginData.userID,
        }
        socket.emit('lobby',userSocketData)
        socket.on('onlineOfflineUser',onlineData=>{
            const onData = onlineData.data.filter((d) => userFriendList.includes(d.userID)).map((d) => d.userID);
            const offData = userFriendList.filter(d=> !onData.includes(d))
            setOnlineUsers(onData)
            setOfflineUsers(offData)
        })
        socket.on('reloadFriendList',data=>{
            console.log(data);
            if(data === userLoginData.userID){
                reloadFriendList(data,URL)
            }
        })
    
    },[userFriendList])
    return(
        <div className="user-conversation">
            <SearchUser 
                userLoginData={userLoginData}
                setUserFriendList={setUserFriendList}
                userFriendList={userFriendList}
                URL={URL}
            />
            <div className="user-friend-list">
                {onlineUsers.length !== 0 && <OnlineUsers onlineUsers={onlineUsers} URL={URL} setChatUser={setChatUser} setToggleMsg={setToggleMsg}/>}
                {offlineUsers.length !== 0 && <OfflineUsers offlineUsers={offlineUsers} URL={URL} setChatUser={setChatUser} setToggleMsg={setToggleMsg}/>}
            </div>
        </div>
    )
}

const OnlineUsers = ({onlineUsers,URL,setChatUser,setToggleMsg})=>{
    return(
        <div className="friends-state online">
            <div className="list">
                {onlineUsers.map(data=>(
                    <EachFriend key={data} d={data} URL={URL} setChatUser={setChatUser} setToggleMsg={setToggleMsg}/>
                ))}
            </div>
        </div>
    )
}
const OfflineUsers = ({offlineUsers,URL,setChatUser,setToggleMsg})=>{
    return(
        <div className="friends-state">
            <div className="list">
                {offlineUsers.map(data=>(
                    <EachFriend key={data} d={data} URL={URL} setChatUser={setChatUser} setToggleMsg={setToggleMsg}/>
                ))}
            </div>
        </div>
    )
}
export default UserConversation
