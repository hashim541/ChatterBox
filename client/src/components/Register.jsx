import { useRef } from "react";


const Register = ({userLog,userLoginError,handelLogin }) =>{
    const nameRef =useRef();
    const idRef=useRef();
    const passRef=useRef();
    const userErrorData=userLoginError.uniqueUserIdError;

    return(
            
        <form className="hero-form" onSubmit={(e)=>{
            if(userLog){
                handelLogin(nameRef,idRef,passRef,e)
            }else{
                handelLogin('',idRef,passRef,e)
            }
            }}>
            <h3 className="form-title">{userLog?'register':'login'} :</h3>
            {
                userLog&&
                <FormName userLog={userLog} reference={nameRef}/>
            }

            <div className="form-idiv">
                <label htmlFor="userID">UserID</label>
                <input 
                    ref={idRef}
                    type="text" 
                    name="userID" 
                    id="uid" 
                    autoComplete="username" 
                    placeholder="Unique Name" 
                    required/>
                {userErrorData.state && userErrorData.on === 'userID'?<ErrorPara text={userErrorData.message}/>:null}
            </div>

            <div className="form-idiv">
                <label htmlFor="password">Password</label>
                <input 
                    ref={passRef}
                    type="password" 
                    name="password" 
                    id="password" 
                    autoComplete="current-password" 
                    placeholder="123456" 
                    minLength={6} 
                    required/>
                {userErrorData.state && userErrorData.on === 'password'?<ErrorPara text={userErrorData.message}/>:null}
            </div>

            <button 
                className="log full" 
                type="submit">
                {userLog ? 'register':'login'}
            </button>
        </form>

    )
}

const FormName = ({userLog,reference})=>{
    return(
        <div className="form-idiv">
            <label htmlFor="userName">YourName</label>
            <input ref={reference} type="text" name="userName" id="name" placeholder="Your Name" required/>
        </div>
    )
}
const ErrorPara =({text}) =>{
    return(
        <p className="error-msg">{text}</p>
    )
}

export default Register