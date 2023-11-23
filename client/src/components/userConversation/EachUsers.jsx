import userSVG from '../../assets/svg/userProfile.svg'
import chatSVG from '../../assets/svg/chat.svg'
import socket from '../../socket'

const EachUsers = ({URL,data,userID,setUserFriendList,userFriendList})=>{
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
            console.log(newData);
            setUserFriendList(newData)
            console.log(data);
            socket.emit('newFriendAdded',id)
        } catch (error) {
            console.log(error);
        }

    }
    return(
        <div className="each-users">
            <img className={data.isOnline? "eu-img online-img":"eu-img "} src={userSVG} alt="" />
            <div className="name-id">
                <p className="eu-ids">{data.userID}</p>
                <p className="eu-name">{data.userName}</p>
            </div>
            {userFriendList.includes(data.userID)?
                <button className="add">Friends</button>:
                <button className="add" onClick={()=>addFriend(data.userID,userID)} ><img src={chatSVG} alt="" /></button>
            }
        </div>
    )
}
export default EachUsers