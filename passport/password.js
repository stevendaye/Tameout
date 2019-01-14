/* Setting our password utilities */
import crypto from "crypto"; // We load the in-built Node's crypto module to encrypt our password;
import scmp from "scmp"; // to do constant time comparisons;
const Buffer = require("safe-buffer").Buffer; // To pass Bufffers as parameter to the "scmp" function;
import config from "../config";

// At the password creation or user registration, first we take the password to create a secure hash;
const passwordCreate = (password, cb) => {
    crypto.randomBytes(config.crypto.randomSize, (err, salt) => {
        if (err)
            return cb(err, null);
        crypto.pbkdf2(password, salt.toString("base64"), config.crypto.workFactor, config.crypto.keylen, config.crypto.digest, (err, key) => {
            cb(null, salt.toString("base64"), key.toString("base64"));
        });
    });
};

// Then we check the password using the "scmp" module. This neccessary for loging in to see if the password matches;
const passwordCheck = (password, derivedPassword, salt, work, cb) => {
    crypto.pbkdf2(password, salt, work, config.crypto.keylen, config.crypto.digest, (err, key) => {
        const derivedKey = Buffer.from(key.toString("base64"));
        const derivedPass = Buffer.from(derivedPassword);
        cb(null, scmp(derivedKey, derivedPass)); // returns true if the passwords match;
    });
};
// From versions 1+, the "scmp()" function takes a Buffer argument and the "crypto" module takes a digest(an algorithm for encrtytion);

export { passwordCreate, passwordCheck };
