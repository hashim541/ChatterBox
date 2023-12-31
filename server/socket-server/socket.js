const axios = require('axios')
const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:5173', 'https://hashim541.github.io'],
    },
})

const onlineUsers = {}
const URL = 'https://chatterbox-server-0czw.onrender.com'

io.on('connection', (socket) => {
    socket.on('lobby', async (data) => {
        console.log(data);
        onlineUsers[data.socketID] = data
        const userData = { userID: data.userID, isOnline: true }
        setUserIsOnline(axios, userData)
        emitOnlineOfflineUsers(socket)
    });
    socket.on('newFriendAdded',da=>{
        io.emit('reloadFriendList', da)
    })
    socket.on('listenMessage',data =>{
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
        const response = await axios.put(`${URL}/socket/setUserIsOnline`, options,{timeout:5000});
    } catch (err) {
        console.error(err);
    }
};

const removeDisconnectedUser = (id) => {
    delete onlineUsers[id];
};

