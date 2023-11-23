import sendSVG from '../../assets/svg/send.svg'

const SendMessage = ({refe,handelSendMessage})=>{
    return(
        <div className="send-message">
            <input ref={refe} type="text" name="message" id="message" />
            <button className="send-msg" onClick={(e)=>handelSendMessage(e)}><img src={sendSVG} alt="" /></button>
        </div>
    )
}
export default SendMessage