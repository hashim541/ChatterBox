import { useEffect, useState } from 'react'
import HeroSection from './components/HeroSection'
import Navbar from './components/Navbar'
import Home from './components/Home'

const App = () => {
    const[userLoginData,setUserLoginData]=useState({
        userName:'',
        userID:'',
        password:''
    })
    const [isUserAuthenticated,setIsUserAuthenticated]=useState(false)
    const [fetchLogin,setFetchLogin]=useState(false)
    const [userLog,setUserLog]=useState(true)
    const [userLoginError,setUserLoginError]=useState({
        uniqueUserIdError:{
            state:false,
            message:'',
            on:''
        }
    })
    const URL = 'https://chatterbox-server-0czw.onrender.com'

    const handelLogin = (name,id,pass,e)=>{
        var uname=''
        if( typeof name !== 'string'){
            uname=name.current.value
        }
        e.preventDefault();
        setUserLoginData({
            userName:uname,
            userID:id.current.value,
            password:pass.current.value
        })
        setFetchLogin(true)
    }

    const loginUser = async()=>{
        const path='/login'
        const options={
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userLoginData)
        }
        try {
            console.log(JSON.stringify(userLoginData));
            const response = await fetch(URL+path,options);

            const data = await response.json()
            if(data.state){
                const newUserLoginError ={
                    uniqueUserIdError:{
                        state:false,
                        message:'',
                        on:data.on
                    }
                }
                setUserLoginError(newUserLoginError)
                setIsUserAuthenticated(true)
                console.log('user logedin');
            }else{
                const newUserLoginError ={
                    uniqueUserIdError:{
                        state:true,
                        message:data.message,
                        on:data.on
                    }
                }
                setUserLoginError(newUserLoginError)
                console.log('user logedin failed');
            }
        } catch (error) {
            console.log(error);
        }finally{
            setFetchLogin(false);
        }
    }
    useEffect(()=>{
        if( fetchLogin && userLoginData.userID.length!==0){
            loginUser()
        }
    },[fetchLogin])
    return(
        <main>
            <Navbar 
                userLog={userLog}
                setUserLog={setUserLog}
                setUserLoginData={setUserLoginData}
                setUserLoginError={setUserLoginError}
                isUserAuthenticated={isUserAuthenticated}
                setIsUserAuthenticated={setIsUserAuthenticated}
                setFetchLogin={setFetchLogin}
            />
            {isUserAuthenticated && 
            <Home 
                isUserAuthenticated={isUserAuthenticated}
                userLoginData={userLoginData}
                URL={URL}
            />}
            {!isUserAuthenticated&&
            <HeroSection
                userLog={userLog}
                userLoginError={userLoginError}
                handelLogin={handelLogin}
            />}
        </main>
    )
}


export default App