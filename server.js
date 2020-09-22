const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();

//init middleware
app.use(express.json({
    extended: false
}));

app.get('/', (req, res) => res.send('API running'));

//defines router
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));
app.use('/charities', require('./routes/charities'));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));