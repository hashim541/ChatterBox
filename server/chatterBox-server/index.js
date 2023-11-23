require('dotenv').config();
const express =require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt= require('bcrypt')
const saltRounds = 10;

const app=express();
const port=3001;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const databaseName = process.env.DB_NAME;
const URL=`mongodb+srv://${username}:${password}@cbox.vqjb3kr.mongodb.net/${databaseName}?retryWrites=true&w=majority`

app.use(express.json())
app.use(cors())

// 'mongodb://127.0.0.1:27017/chatterBox'
mongoose.connect(URL)
.then(()=>{
    console.log('connected to database');
})
.catch((e)=>{
    console.log(e);
})


const userSchema = mongoose.Schema({
    userName:{
        type:String
    },
    userID:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    isOnline:{
        type:Boolean
    },
    userConversations:{
        type:Array
    },
    lastOnline:{
        type:String
    }
})

const User =new mongoose.model('User',userSchema)


const messageSchema=mongoose.Schema({
    room:Number,
    users:Array,
    messages:Array
})

const Message = new mongoose.model('Message',messageSchema)

app.post('/searchUsers', async(req,res)=>{
    const data=req.body;
    if(data.inputName === ''){
        res.status(200).json([])
    }else{
        try {
            const searchUsers = await User
            .find({ userID: { $regex: `^${data.inputName}`, $options: 'i' ,$ne:data.userID} })
            .select({ userName: 1, userID: 1,isOnline: 1, _id: 0 })
            .exec()
            .then((foundUser)=>{
                res.status(200).json(foundUser)
            })
            .catch((error)=>{
                console.log(error);
            })
        } catch (error) {
            console.log(error);
        }
    }
})


app.put('/addFriend',async(req,res)=>{
    const data =req.body
    const room = Date.now();
    const userFriendData={
        uid:data.newFriend,
        room:room
    }
    const FriendData={
        uid:data.userID,
        room:room
    }
    try {
        const addInFriends= await User.findOneAndUpdate({userID:data.newFriend},{$push:{userConversations:FriendData}},{new:true})
        const add = await User.findOneAndUpdate({userID:data.userID},{$push:{userConversations:userFriendData}},{new:true})
        .then((user)=>{
            res.status(200).json(user)
        })
        .catch((error)=>{
            console.log(error);
        })
    } catch (error) {
        console.log(error);
    }
    const newMessage= new Message({
        room:room,
        users:[data.newFriend,data.userID],
        messages:[]
    })
    newMessage.save()
    .then((message)=>{
    })
    .catch((err)=>{
        console.log(err);
    })
})


app.post('/usersData',async (req,res)=>{
    const data =req.body;
    try {
        const userInfo = await User.findOne({userID:data.userID})
        .select({userName:1,userID:1,userConversations:1,lastOnline:1,
            isOnline:1,_id:0})
        .exec()
        .then((user)=>{
            res.status(200).json(user)
        })
        .catch((error)=>{
            console.log(error);
        })
    } catch (error) {
        console.log(error);
    }
    
})

app.post('/login',async (req,res)=>{
    const data = req.body;
    if(data.userName.length !== 0){
        bcrypt.hash(data.password, saltRounds , (err,hash)=>{
            const newUser = new User({
                userName:data.userName,
                userID:data.userID,
                password:hash,
                isOnline:false,
                userConversations:[]
            })
            newUser.save()
            .then((user)=>{
                res.status(200).json({state:true,message:'User register successfully.',on:'userID'})
            })
            .catch((e)=>{
                res.status(400).json({state:false,message:'User with that id already exists. Try unique id.',on:'userID'})
            })
        })
    }else{
        const loginData = await User.find({userID:data.userID})
        if(loginData.length===0){
            res.status(400).json({state:false,message:`User with that id dosen't exists.`,on:'userID'})
        }else{
            bcrypt.compare(data.password,loginData[0].password,(err,result)=>{
                if(result){
                    res.status(200).json({state:true,message:'User logedin successfully.',on:'password'})
                }else{
                    res.status(200).json({state:false,message:'Invalid password. Try again.',on:'password'})
                }
            })
        }
    }
})


app.put('/socket/setUserIsOnline',async (req,res)=>{
    const data = req.body

    const timestamp = Date.now();
    const date = new Date(timestamp);
    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
    const formattedDateTime = formatter.format(date);

    try {
        const updateUSer= await User.findOneAndUpdate({userID:data.userID},{isOnline:data.isOnline,lastOnline:formattedDateTime})
        .then((user)=>{
        })
        .catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
})


app.post('/setMessages',async(req,res)=>{
    const msgData=req.body
    const limit = 5;
    try {
        const messagesData = await Message.findOne({room:msgData.currRoom})
        const pushMessage = await Message.findOneAndUpdate({room:msgData.currRoom},{$push:{messages:msgData.data}},{new:true})
        .then(async (sendMessage)=>{
            if(sendMessage.messages.length <= limit){
                res.status(200).json(sendMessage.messages)
            }else{
                const newArray = sendMessage.messages.slice(-limit)
                try {
                    const newData = await Message.findOneAndUpdate({room:msgData.currRoom},{messages:newArray})
                    .then((result)=>{
                        res.status(200).json(result.messages)
                    })
                } catch (error) {
                    console.log(error);
                }
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    } catch (error) {
        console.log(error);
    }
})
app.post('/getMessages',async(req,res)=>{
    const data =req.body;
    try {
        const response = await Message.findOne({room:data.currRoom})
        .then((result)=>{
            res.status(200).json(result.messages)
        })
        .catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
})

app.listen(port,()=>{
    console.log('server is running');
})
