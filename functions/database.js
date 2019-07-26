const mysql = require('mysql');
const util = require('util');

//process.env.MYSQL_HOST will be used as host if application is running in docker container else localhost will be used as host
const host = process.env.MYSQL_HOST ? process.env.MYSQL_HOST : 'localhost';

//Initialize the user and password who can access the mysql server
const user = process.env.USERNAME ? process.env.USERNAME : 'root';
const password = process.env.PASSWORD ? process.env.PASSWORD : 'rootpassword';
const database = process.env.DATABASE_NAME ? process.env.DATABASE_NAME : 'shop';

const config = {
    host: host,
    user: user,
    password: password,
    database: database
}

//Create a connection for mysql server
const connection = mysql.createConnection(config);

// node native promisify
const query = util.promisify(connection.query).bind(connection);

//Check whether the connection is established to the mysql server
connection.connect(async (err) => {
    if(err) {
        console.error(`Error while connecting to the mysql server ${err}`);
        throw err;
    }
    console.log('Successfully conencted to the server');
});

//- Error listener
connection.on('error', function(err) {

    //- The server close the connection.
    if(err.code === "PROTOCOL_CONNECTION_LOST"){    
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

    //- Connection in closing
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

    //- Fatal error : connection variable must be recreated
    else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

    //- Error because a connection is already being established
    else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
    }

    //- Anything else
    else{
        console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
        connection = reconnect(connection);
    }

});

module.exports = query;