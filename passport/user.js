/* Setting up the user's database to find and add users */
import { passwordCreate } from "./password";

let findByUsername, addUser, updatePassword, Users;

// Storing a user into the database;
Users = {};

// Finding users;
findByUsername = (username, cb) => {
    cb(null, Users[username]);
};
// Adding users;
addUser = (username, password, work, cb) => {
    if (Users[username] === undefined)  {
        passwordCreate(password, (err, salt, password) => {
            Users[username] = {
                salt: salt,
                password: password,
                work: work,
                displayName: username,
                id: username,
                provider: "local",
                username: username,
            };
            return cb(Users[username]);
        });
    }
};

// Updating password;
updatePassword = (username, password, work) => {
    passwordCreate(password, (err, salt, password) => {
        Users[username].password = password;
        Users[username].salt = salt;
        Users[username].work = work;
    });
};

export { findByUsername, addUser, updatePassword };
