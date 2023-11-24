import userSVG from '../../assets/svg/userProfile.svg'
import chatSVG from '../../assets/svg/chat.svg'
import socket from '../../socket'
import { useEffect, useState } from 'react'

const EachUsers = ({URL,data,userID,setUserFriendList,userFriendList})=>{
    const [userIsInList,setUserIsInList]=useState(false)
    const addFriend = async(id,uID)=>{
        const path='/addFriend'
        const options={
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newFriend:id,userID:uID})
        }
        try {
            const response = await fetch(URL+path,options)
            const data = await response.json()
            const newData=data.userConversations.map(d=>{
                return d.uid
            })
            setUserFriendList(newData)
            socket.emit('newFriendAdded',id)
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(()=>{
        if(userFriendList.includes(data.userID)){
            setUserIsInList(true)
        }

    },[])
    return(
        <div className="each-users">
            <img className={data.isOnline? "eu-img online-img":"eu-img "} src={userSVG} alt="" />
            <div className="name-id">
                <p className="eu-ids">{data.userID}</p>
                <p className="eu-name">{data.userName}</p>
            </div>
            {userIsInList?
                <button className="add">Friends</button>:
                <button className="add" onClick={(e)=>{
                    setUserIsInList(true)
                    addFriend(data.userID,userID)
                }} ><img src={chatSVG} alt="" /></button>
            }
        </div>
    )
}
export default EachUsers