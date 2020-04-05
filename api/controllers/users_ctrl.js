//-------------------------------------------------------------
const mongoose = require('mongoose');
const User     = require('../models/user_model');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
//-------------------------------------------------------------

const JWT_KEY = process.env.JWT_KEY;

// GET all user
// Todo: add control for administrators only
exports.users_get_all = (req, res, next) => {
    User
        .find()
        .exec()
        .then(docs => {
            // User found
            const response = {
                count: docs.length,
                user:  docs.map(doc => {
                    return {
                        email:    doc.email,
                        //password: doc.password,
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(error => {
            // User not found
            res.status(500).json({
                message: error
            }); 
        });
}
// POST request to signup and add user to the db
exports.users_signup = (req, res, next) => {
    User
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length >= 1){
                // A user with this email already exists
                res.status(409).json({
                    message: 'Mail exists'
                }); 
            }else{
                // There is no user with this email
                // Password encryption for greater security
                bcrypt.hash(req.body.password, 10, (error, hash) =>{
                    if (error){
                        // Encryption error
                        return res.status(500).json({
                            message: "Password Error"
                        });
                    }else{
                        // Store hash in password DB.
                        const user = new User({
                            _id:      new mongoose.Types.ObjectId(),
                            email:    req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User Created'
                                });
                            })
                            .catch(error => {
                                res.status(500).json({
                                    message: "Signup fail"
                                });
                            })
                    }
                });
            }
        })
}
// POST request to login and receive TOKEN
exports.users_login = (req, res, next) => {
    User
    .find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length < 1){
            // A user with this email does not exist
            return res.status(404).json({
                message: 'Auth failed: Email does not exist'
            });
        }
        // Load hash from password DB. Password decryption
        bcrypt.compare(req.body.password, user[0].password, (error, result) =>{
            if(error){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if(result){
                // Token creation
                const token = jwt.sign({ 
                        email:    user[0].email,
                        userId:   user[0]._id
                    }, 
                    JWT_KEY, 
                    {
                        // Token's life time 
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token:   token,
                    _id:     user[0]._id
                });
            }
            res.status(401).json({
                message: 'Auth failed: Wrong password'
            });
        });
    })
    .catch(error => {
        res.status(500).json({
            message: error
        });
    })
}
// DELETE specific user
// Todo: add control for administrators only
exports.users_delete_user = (req, res, next) => {
    const id = req.params.userId;

    User.findByIdAndRemove(id, (error, product) => {
        if (error) return res.status(500).send(error);

        const response = {
            message: "User successfully deleted",
            request: {
                descriprion: 'To Signup',
                type: 'POST',
                body: { email: 'String', password: 'Number' },
                url: 'http://localhost:3000/users/signup'
            }
        };
        return res.status(200).send(response);
    });

}