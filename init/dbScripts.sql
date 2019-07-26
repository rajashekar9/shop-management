CREATE DATABASE shop;
GRANT ALL PRIVILEGES ON shop.* TO 'user'@'%' IDENTIFIED BY 'mysql';
GRANT ALL PRIVILEGES ON shop.* TO 'user'@'localhost' IDENTIFIED BY 'mysql';
USE shop
CREATE TABLE users (
    user_id VARCHAR(50) NOT NULL PRIMARY KEY,
    user_name VARCHAR(15) NOT NULL,
    gender VARCHAR(7) NOT NULL,
    city VARCHAR(20) NOT NULL
);

CREATE TABLE user_roles (
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    user_role NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);