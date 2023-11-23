import { useEffect, useRef, useState } from "react"
import userSVG from '../../assets/svg/userProfile.svg'
import EachUsers from "./EachUsers"

const SearchUser = ({userLoginData,setUserFriendList,userFriendList,URL})=>{
    const searchREF = useRef()
    const [searchUser,setSearchUser]=useState([])
    const [userData,setUserData]=useState({})
    
    useEffect(()=>{
        const handelUserData = async(URL)=>{
            const path='/searchUsers'
            const options={
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({inputName:userLoginData.userID,userID:''})
            }
            try {
                const response = await fetch(URL+path,options)
                const data = await response.json();
                setUserData(data[0])
            } catch (error) {
                console.log(error);
            }
        }
        const handelSearch = async()=>{
            const userInput = searchREF.current.value
            const path='/searchUsers'
            const options={
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({inputName:userInput,userID:userLoginData.userID})
            }
            try {
                const response = await fetch(URL+path,options)
                const data = await response.json();
                setSearchUser(data)
            } catch (error) {
                console.log(error);
            }
            
        }
        handelUserData(URL)
        searchREF.current.addEventListener('keyup',handelSearch);
        return ()=>{
            searchREF.current.removeEventListener('keyup',handelSearch)
        }
    },[])
    return(
        <div className="search-div">
            <div className="user-profile">
                <img className="eu-img online-img pro-img" src={userSVG} alt="" />
                <div className="profile">
                    <p className="pro-name">{userData.userName}</p>
                    <p className="pro-id">{userData.userID}</p>
                </div>
            </div>
            <input 
                style={searchUser.length===0?{marginBottom:'0px'}:{marginBottom:'10px'}}
                ref={searchREF}
                type="text"
                name="search" 
                id="search" 
                placeholder="Search User with there userID"   
            />
            {searchUser.map( (eachUsers,i)=>(
                <EachUsers key={i} data={eachUsers} userFriendList={userFriendList} userID={userLoginData.userID} setUserFriendList={setUserFriendList}/>
            ))}
        </div>
    )
}

export default SearchUser