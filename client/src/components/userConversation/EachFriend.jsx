import userSVG from '../../assets/svg/userProfile.svg'
import { useEffect, useState ,useRef} from 'react'

const EachFriend =({d,URL,setChatUser,setToggleMsg})=>{
    const [data,setData]=useState({})
    const [isDataLoaded,setIsDataLoaded]=useState(false)
    

    const eachFriend = async (d,URL)=>{
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
            const datas = await response.json();
            setData(datas)
            setIsDataLoaded(true)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        eachFriend(d,URL)
    },[])
    if(isDataLoaded){
        return(
            <div className="each-friend" onClick={()=>{
                setChatUser(data)
                setToggleMsg(true)
            }}>
                <div className="each-users friends-profile">
                    <img className={data.isOnline? "eu-img online-img":"eu-img "} src={userSVG} alt="" />
                    <div className="name-id">
                        <p className="eu-id name2">{data.userName}</p>
                        <p className="eu-name id2">{data.userID}</p>
                    </div>
                    <div className="status-content">
                        <div className={data.isOnline?"status on-status":"status off-status"}>{data.isOnline?'Online':'Offline'}</div>
                        {data.isOnline===false  && <LastOnline text={data.lastOnline}/>}
                    </div>
                </div>
                <div className="line"></div>
            </div> 
        )
    }
}
const LastOnline =({text})=>{
    return(
        <div className="status-time">{text}</div>
    )
}
export default EachFriend