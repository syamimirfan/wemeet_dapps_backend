const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors({
    origin: "*",
}))

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//get Admin controller
const adminRouter = require('../WEMEET-DAPPS-BACKEND/controller/Admin');
app.use('/admin', adminRouter);

// get Student controller
const studentRouter = require('../WEMEET-DAPPS-BACKEND/controller/Student');
app.use('/student', studentRouter);

//get Lecturer controller
const lecturerRouter = require('../WEMEET-DAPPS-BACKEND/controller/Lecturer');
app.use('/lecturer', lecturerRouter);

//get Slot controller
const slotRouter = require('../WEMEET-DAPPS-BACKEND/controller/Slot');
app.use('/slot', slotRouter);

//get Booking controller
const bookingRouter = require('../WEMEET-DAPPS-BACKEND/controller/Booking');
app.use('/booking', bookingRouter);

//get Attendance controller
const attendanceRouter = require('../WEMEET-DAPPS-BACKEND/controller/Attendance');
app.use('/attendance', attendanceRouter);

//get Hash controller
const hashController = require('../WEMEET-DAPPS-BACKEND/controller/Hash');
app.use('/hash', hashController);

//get Chat controller
const chatController = require('../WEMEET-DAPPS-BACKEND/controller/Chat');
app.use('/chat', chatController);


const server = app.listen(5000, () => console.log('your server is running on port 5000'));


const io = require('socket.io')(server);

io.on('connection', (socket) => {
    // console.log("Connected Successfully");
    
    // socket.on('disconnect', () => {
    //     console.log('Disconnected');
    // });

    socket.on('message', (data) => {
        // console.log(data);
        socket.broadcast.emit('message-receive', data);
    });
  
});
