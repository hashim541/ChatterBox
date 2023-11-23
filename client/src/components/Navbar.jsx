import boxSVG from '../assets/svg/box.svg'

const Navbar =({userLog,setUserLog,setUserLoginData,setUserLoginError,isUserAuthenticated,setIsUserAuthenticated,setFetchLogin})=>{
    const handelForm = ()=>{
        setUserLog(!userLog)
        setUserLoginData({
            userName:'',
            userID:'',
            password:''
        })
        const newUserLoginError ={
            uniqueUserIdError:{
                state:false,
                message:'',
                on:'userID'
            }
        }
        
        setUserLoginError(newUserLoginError)
    }
    return(
        <nav className='nav'>
            <div className="logo">
                <h1 className="nav-title">chatter-box</h1>
                <img className='nav-img' src={boxSVG} alt="" />
            </div>
            {!isUserAuthenticated ? 
            <button className="log" onClick={()=>handelForm(userLog)}>{!userLog ? 'register':'login'}</button>
            :
            <button className='log' onClick={()=>{
                window.location.reload()
                }}>Logout</button>
            }
        </nav>
    )
}

export default Navbar