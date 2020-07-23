require('dotenv').config();
const  mongoose = require('mongoose');
const init = require('./routes');

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser : true})
        .then(() => {
            console.log("Database is running");
        })
        .catch(err => {
            console.log(err);
        })

init.init();

