import userSVG from '../../assets/svg/userProfile.svg'
import backSVG from '../../assets/svg/back.svg'
import { useEffect,useState } from 'react';

const MUNavbar =({userData,setToggleMsg})=>{
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []); 
    return(
        <nav className='nav2'>
            {windowWidth < 900 && <BackBtn setToggleMsg={setToggleMsg}/>}
            <div className="user-profile">
                <img className={userData.isOnline? "eu-img online-img pro-img":"eu-img pro-img"} src={userSVG} alt="" />
                <div className="profile pp">
                    <p className="pro-name">{userData.userName}</p>
                    <p className={userData.isOnline?"status on-status stat":"status off-status stat2"}>{userData.isOnline?'Online':`Offline   ${userData.lastOnline}`}</p>
                </div>
            </div>
        </nav>
    )
}

const BackBtn = ({setToggleMsg}) =>{
    return(
        <button className='back' onClick={()=>setToggleMsg(false)}><img src={backSVG} alt="" /></button>
    )
}
export default MUNavbar