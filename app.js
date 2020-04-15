const express = require('express');
const connectDB = require('./config/db')
const app = express();
const cors = require('cors');

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

app.get('/', (req, res)=>{
    res.send('APT running');
})

// Define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000 ;

app.listen(PORT, ()=>{console.log(`Server running on port ${PORT}`)});

