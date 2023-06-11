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
const adminRouter = require('./controller/Admin');
app.use('/admin', adminRouter);

// get Student controller
const studentRouter = require('./controller/Student');
app.use('/student', studentRouter);

//get Lecturer controller
const lecturerRouter = require('./controller/Lecturer');
app.use('/lecturer', lecturerRouter);

//get Slot controller
const slotRouter = require('./controller/Slot');
app.use('/slot', slotRouter);

//get Booking controller
const bookingRouter = require('./controller/Booking');
app.use('/booking', bookingRouter);

//get Attendance controller
const attendanceRouter = require('./controller/Attendance');
app.use('/attendance', attendanceRouter);

//get Hash controller
const hashController = require('./controller/Hash');
app.use('/hash', hashController);

//get Chat controller
const chatController = require('./controller/Chat');
app.use('/chat', chatController);


const server = app.listen(Number(process.env.PORT || 5000), "0.0.0.0", () => console.log(`your server is running on port http://localhost:${process.env.PORT}`));

//for socket in real time chat app
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
