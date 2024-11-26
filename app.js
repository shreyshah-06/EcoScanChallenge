const express = require('express');
const dbConnect = require('./db/dbconnect');
const cors = require("cors");
const app = express();
require('dotenv').config();

const PORT  = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
app.use(cors());
app.use(express.json());
app.use('/api', require('./routes'));

const serverStart = async()=>{
    try {
        await dbConnect(MONGO_URI)
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (error) {
        console.log(error)
    }
};
serverStart();

