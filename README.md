# shop-management
This is the assignment project for registering users based on their roles

## Project setup using docker:

### Prequisties:
Docker need to be installed in your machine
Node.js should be installed in your host machine

#### Run the application:

1. Navigate to the project root repository and run the following commands
    - "cd functions" (Navigate to functions folder which contains package.json)
    - "npm install" (Installs all the dependencies for the project)
    - "cd .."
    - "docker build -t node_server ." (This command need to be run at location of Dockerfile to build node_server image)
    - 'docker-compose up -d' (This command need to be run at location of docker-compose.yml)

    By running the above command both mysql server and node server will be started. By default database with name 'shop' will be created along with the tables users, user_roles in the mysql server

2. Run the following command to know whether the two containers are up and running
    - 'docker ps'

    Now, you should be able to see the following 
    
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
3fc94c3fdbb0        node_server         "node /usr/src/app/f…"   22 seconds ago      Up 20 seconds       0.0.0.0:5001->5001/tcp              node
8435b6e5e71a        mysql               "docker-entrypoint.s…"   22 seconds ago      Up 22 seconds       0.0.0.0:3306->3306/tcp, 33060/tcp   mysql

3. You can check the container logs using docker logs containerName (containerName can be either mysql or node)
4. There is a chance of getting authentication issue when accessing the database from the node hence, run the following commands to get rid out of it
    - 'docker exec -it mysql /bin/bash' (By running this command you will be entering into the mysql contianer shell)
    - 'mysql -uroot -prootpassword' (By running this command, you will be logged into mysql server as root)
    - 'ALTER USER root IDENTIFIED WITH mysql_native_password BY 'rootpassword';
    - 'exit' (By running this command you will come out of the mysql server);
    - 'exit' (By running this command you will come out of the mysql container shell);
    - 'docker-compose up -d --force-recreate' (By running this command the two containers will recreated forcefully);

### Registering users

You need to send a post request to 'http://yourMachineIpAddress:5001/users'
(yourMachineIpAddress means ip address of the machine on which docker is running)

User details need to be sent in request body as follows:

let body = {
    userName: userName,
    gender: gender,
    city: city
}

Only the first registered user will be assigned 'admin' as his/her role. Rest of the users will have different roles

After firing a request you can see the message 'Successfully registered the user'

## Project setup in local machine:

### Prequisities:
MySQL server (> 8 version) and node.js need to be installed in your local machine

First Database and tables should be created in MySQL server. For that Run the following commands in your mysql-client

    1. CREATE DATABASE shop; //By running this command database with name 'shop' will be created

    2. USE shop; //Run this command to use the shop database

    //Following command is for create users table
    3. CREATE TABLE users (
        user_id VARCHAR(50) NOT NULL PRIMARY KEY,
        user_name VARCHAR(15) NOT NULL,
        gender VARCHAR(7) NOT NULL,
        city VARCHAR(20) NOT NULL
    );

    //Following command is for create user_roles table
    4. CREATE TABLE user_roles (
        id VARCHAR(50) NOT NULL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        user_role NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

Now navigate to project root repository in command prompt and run the following commands to start the project
    - "cd functions" (Navigates to functions folder where you have package.json)
    - "npm install" (By running this command it will install all the required dependencies)
    - "npm start" or "node index.js" (BY running this command node server will be running on your localhost on port 5001)
    

Note: There is a chance of getting authentication issue when accessing the database from the node. If you are facing this issue while registering the users then follow the following steps to get rid out of it

- Stop the node project by pressing ctrl+c
- Open the mysql-client and run the following command to alter the user
    - 'ALTER USER root@'localhost' IDENTIFIED WITH mysql_native_password BY 'rootpassword'; and then
    - 'exit' (To come out of the mysql client)
- Now start the project by running following command in the project root repository from command line
    - 'npm start' 

## Registering users

You need to send a post request to 'http://127.0.0.1:5001/users'
User details need to be sent in request body as follows:

let body = {
    userName: userName,
    gender: gender,
    city: city
}

Only the first registered user will be assigned 'admin' as his/her role. Rest of the users will have different roles

After firing a request you can see the message 'Successfully registered the user'
