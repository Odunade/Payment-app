var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit:100,
    multipleStatements: true,
   
    port: process.env.DB_PORT, // Replace with your port number
    host: process.env.DB_HOST, // Replace with your host name
    user: process.env.DB_USER, // Replace with your database username
    password: process.env.DB_PASS, // Replace with your database password
    database: process.env.DB_NAME // // Replace with your database Name
});


connection.connect(function(err) {
    if (err) {
        console.log("this error")
    }else{

        console.log('Database is connected successfully !');
    }
});

module.exports = connection;