// Load local environmental variables
require('dotenv').config();
// NOTE: for the variable to load correctly, a .env file with a DATABASE_URL must be located in the same folder as this .js program

// Load encryption middleware
const bcrypt = require('bcrypt');

// Load console input package
const prompt = require('prompt-sync')({sigint: true});

// Get user input
console.log('Welcome. This application will generate a secure password for insertion into the Sunshine Learning Portal user database.');
const password = prompt('Please enter a password: ');
const hashedPassword = bcrypt.hashSync(password, 12);
console.log(`The generated password is: ${hashedPassword}`);
