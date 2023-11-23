import EachMessage from "./EachMessage";
const MessageBox = ({userLoginData,userMessages,reference})=>{
    return(
        <div  className="message-box">
            {userMessages.map( ( data,i) =>(
                <EachMessage key={data.msg+i} userLoginData={userLoginData} d={data}/>
            ))}
            <div ref={reference} className="dummy"></div>
            <p className="opac">messageing limit is 35</p>
        </div>
    )
}

export default MessageBox