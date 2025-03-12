const expresss = require('express');
const errorHandler = require('./middleware/errorhandler');
const connectDB = require('./config/dbconnection');
const dotenv = require('dotenv').config();

connectDB();
const app = expresss();

const port = process.env.PORT || 5000;

app.use(expresss.json());
app.use('/api/contacts', require("./routes/contactRoute"));
app.use('/api/users', require("./routes/userRoute"));
app.use(errorHandler);  // when ever we use want use the middleware we need to use in app.use

// This app will listen on the port 5000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});