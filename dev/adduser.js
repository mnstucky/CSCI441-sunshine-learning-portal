// Load local environmental variables
require('dotenv').config();
// NOTE: for the variable to load correctly, a .env file with a DATABASE_URL must be located in the same folder as this .js program

// Load encryption middleware
const bcrypt = require('bcrypt');

// Load database services
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Load console input package
const prompt = require('prompt-sync')({sigint: true});

// Define database access functions
function addUser(username, password) {
    try {
        client.connect();
        client.query(`INSERT INTO logins (username, password) VALUES ('${username}', '${password}')`, (err, res) => {
            if (err) console.error(err);
            console.log(`Success! Inserted the following: ${username} (username), ${password} (password)`);
            client.end();
        });
    } catch (err) {
        console.error(err);
    }
}

// Get user input
console.log('Welcome. This application will allow you to add users, with encrypted passwords, to the Sunshine Learning Portal user database.');
const username = prompt('Please enter a username: ');
const password = prompt('Please enter a password: ');
const hashedPassword = bcrypt.hashSync(password, 12);
addUser(username, hashedPassword);
