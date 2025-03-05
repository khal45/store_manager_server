### Server Code for Store Manager Web App

To run this project locally:

1. Install all packages in the root folder with npm install.
2. Create a .env file in the root folder and create PORT and ACCESS_TOKEN_SECRET variables.
3. Set the PORT to your port number and ACCESS_TOKEN_SECRET to your secret (use the node crypto function to generate a random bytes string).
4. Navigate to the usersDb.js file for the usernames of the users.
5. The password of each user is in the format: `username@role` eg johndoe's password is: `johndoe@admin`.
6. Run "npm test" to run the test.
