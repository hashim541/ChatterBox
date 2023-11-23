import Register from "./Register"
import homeIMG from '../assets/images/homeIMG.jpg'

const HeroSection = ({userLog,userLoginError,handelLogin}) => {
    return (
        <div className="hero-section">
            <div className="login-div">
                <p className="hero-desc">👋 Hello there! Welcome to <span className="light">Chatter-box</span>. The place where conversations come to life! Whether you're connecting with friends, collaborating with colleagues, or meeting new people, we've got you covered.<br /><span className="bold">Start chatting by loging in.</span></p>
                <Register
                    userLog={userLog}
                    userLoginError={userLoginError}
                    handelLogin={handelLogin}
                />
            </div>
            <img className="hero-img" src={homeIMG} alt="" />
        </div>
    )
}
export default HeroSection