const axios = require('axios')
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173'],
    },
})

const onlineUsers = {}
const URL = 'http://localhost:3001'

io.on('connection', (socket) => {
    socket.on('lobby', async (data) => {
        onlineUsers[data.socketID] = data
        const userData = { userID: data.userID, isOnline: true }
        setUserIsOnline(axios, userData)
        emitOnlineOfflineUsers(socket)
    });
    socket.on('newFriendAdded',da=>{
        io.emit('reloadFriendList', da)
    })
    socket.on('listenMessage',data =>{
        console.log(data);
        io.emit('reloadMessage',data)
    })

    socket.on('disconnect', async () => {
        if (onlineUsers[socket.id]) {
            const data = onlineUsers[socket.id]
            const userData = { userID: data.userID, isOnline: false }
            setUserIsOnline(axios, userData)
            removeDisconnectedUser(socket.id)
            emitOnlineOfflineUsers(socket)
        }
    });

    const emitOnlineOfflineUsers = () => {
        io.emit('onlineOfflineUser', { data: Object.values(onlineUsers) })
    }
});

const setUserIsOnline = async (axios, options) => {
    try {
        const response = await axios.put(`${URL}/socket/setUserIsOnline`, options,{timeout:1000});
    } catch (err) {
        console.error(err);
    }
};

const removeDisconnectedUser = (id) => {
    delete onlineUsers[id];
};

