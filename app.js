const express = require('express');
const connectDB = require('./config/db')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');



// Connect Database
connectDB();

//Init Middelware
app.use(express.json({ extended: false }))
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb',
    extended: true,
    parameterLimit: 100
}));
app.use(express.static('uploads'));


app.get('/', (req, res)=>{
    res.send('APT running');
})

// Define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/firebase/notification',require('./routes/api/notification'))
app.use('/signature', require('./routes/api/signature'))

const PORT = process.env.PORT || 5000 ;

app.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)});

