F = require('../lib/dbconstants.js');
const uuid = require('uuid/v1');
const sqlQuery = require('../database');
const roles = ['manager', 'salesMen', 'supervisor'];

/**
 * This end point is aimed for adding the users in to database.
 * @options which contains user data and sqlQuery(to access database)
 * If the userList is empty in the database, then the user will be registered as admin else user
 will be registered with random role(any of these: manager, salesMen, supervisor)
 * @returns {registeredUser}
 */
module.exports.registerUser = (options) => {
    return new Promise( async(resolve, reject) => {
        let user = Object.assign({}, options.user);
        console.log('sqlQuery:',sqlQuery);

        console.log('registerUser method invoked with the userDetails:', user);

        try {
            let validationError = validateUserDetails(user);
            if(validationError) {
                console.error('User is not valid:', validationError);
                return reject({status: 405, error: validationError});
            }

            let userExists = await checkIfUserExistsInDb(user);
            if(userExists.error || userExists) {
                return reject({
                    status: 405,
                    error: 'User already exists'
                });
            }

            console.log('Checking whether the user need to be registered as admin');
            let toRegisterAsAdmin = await checkForAdmin(sqlQuery);
            if(toRegisterAsAdmin.error) {
                return reject({
                    status: 505,
                    error: toRegisterAsAdmin.error
                });
            }

            console.log(`Registering the user as ${toRegisterAsAdmin ? 'admin' : user.roleName}`);
            let result = await registerUserInDb(user, sqlQuery, toRegisterAsAdmin);
            if(result.error) {
                return reject({
                    status: 505,
                    error: result.error
                });
            }

            return resolve({
                status: 200,
                data: result.message
            });
        }
        catch(error) {
            console.error('Error while creating the user:', error);
            return reject({
                status: 500,
                error: error
            })
        }
    });
}

/**
 * Check whether the user exists in database
 * @param {Object} userDetails 
 * @returns {Int} It returns either 0 (if user does not exists) or 1 (if user exists)
 */
const checkIfUserExistsInDb = async (userDetails) => {
    let user = Object.assign({}, userDetails);

    try {
        let query = "SELECT EXISTS(SELECT * FROM ?? WHERE ?? = ?) as user_exists"
        let userExists = await sqlQuery(query, [F.USERSTABLE, F.USERTABLEFIELD.USERNAME, user.userName]);

        console.log('userExists is:', userExists[0].user_exists);
        return userExists[0].user_exists;
    }
    catch(error) {
        console.error(`Error while checking user in db: ${error.sqlMessage ? error.sqlMessage : error}`);
        return {error: error.sqlMessage ? error.sqlMessage : error};
    }
}

/**
 * This end point is aimed at verifying whether the user has required data or not
 * If the user data is valid it returns null else error message 
 * @param {object} users userData
 * @returns {string} which contains whether the user is valid or not
 */
const validateUserDetails = (user) => {
    console.log('Started validating the user details');

    let message = '';
    message += !user.userName ? ' userName,' : '';
    message += !user.gender ? ' gender,' : '';
    message += !user.city ? ' city,' : '';

    console.log('Done with user validation');

    if (message)
        message = `${message.substring(1,message.length-1)} ${message.split(',').length > 2 ? 'are' : 'is'} missing`;
    
    return message
}

/**
 * This function is aimed for checking whether the user need to be registered as admin or not;
 * @param {Object} sqlQuery Used for querying on database
 * @returns {Boolean} If the user list in users table is greater than 1 then it will return false else true
 */
const checkForAdmin = async (sqlQuery) => {
    try {
        let query = `SELECT COUNT(*) as number_of_users FROM ${F.USERSTABLE};`
        let result = await sqlQuery(query);

        console.log('result is:', result[0].number_of_users);
        return result[0].number_of_users > 0 ? false : true;
    }
    catch(error) {
        console.error(`Error while checking whether user has to be registed as admin or not ${error.sqlMessage ? error.sqlMessage : error}`);
        return {error: error.sqlMessage ? error.sqlMessage : error};
    }
}

/**
 * This is aimed for adding userDetails in users table and updating user role in user_roles table
 * @param {Object} userData 
 * @param {query} sqlQuery Used to query on database
 * @param {Boolean} isAdmin It is true in case of admin else false
 * @returns {Object} It will be either success message or error message;
 */
const registerUserInDb = async (userData, sqlQuery, isAdmin) => {
    try {
        let user = Object.assign({}, userData);
        let admin = isAdmin;
        let userId = uuid();

        let post = {
            user_id: userId,
            user_name: user.userName,
            gender: user.gender,
            city: user.city
        };
        let query = `INSERT INTO ${F.USERSTABLE} SET ?`;
        console.log('query is:', query);

        await sqlQuery(query, post);
        console.log('Successfully added the user in users_table');

        console.log('Updating user role in user_roles_table');
        post = {
            id: uuid(),
            user_id: userId,
            user_role: admin ? 'admin' : roles[getRandomNumber(0,3)]
        };
        query = `INSERT INTO ${F.USERROLESTABLE} SET ?`;
        await sqlQuery(query, post);

        return {message: 'Successfully registered the user'};
    }
    catch(error) {
        console.error(`Error while registering the user in database: ${error.sqlMessage ? error.sqlMessage : error}`);
        return {error: error.sqlMessage ? error.sqlMessage : error};
    }
}

// Function to generate random number  
const getRandomNumber = (min, max) => {  
    return Math.floor(Math.random() * (max - min) + min); 
}  