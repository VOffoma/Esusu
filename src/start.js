const app = require('./app');

const port = process.env.PORT || 7076;


app.listen(port, () => {
    console.log("The server has been started");
})