const EachMessage = ({userLoginData,d})=>{
    return(
        <div className={userLoginData.userID === d.from ? "my-msg msg":"msg"}>{d.msg}</div>
    )
}
export default EachMessage