const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const { errorHandler, createAccessToken } = require("../auth.js");


module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")){

        return res.status(400).send({error : 'Email invalid'});
    }

    if (req.body.password.length < 8) {

        return res.status(400).send({message: 'Password must be atleast 8 characters'});

    } else {

        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({message: 'Registered successfully'}))
        .catch(error => errorHandler(error, req, res));
    }
};

module.exports.loginUser = (req, res) => {

	if(req.body.email.includes('@')){

		return User.findOne({email: req.body.email})
		.then(result => {

			if(result === null){

				return res.status(404).send({error: 'No email found'});
			}

			else{

				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if(isPasswordCorrect){

					return res.status(200).send({ access : createAccessToken(result)})

				} else{

					return res.status(401).send({ error: 'Email and password do not match' });
				}

			}
		})
		.catch(err => errorHandler(err, req, res));

	} else{

		return res.status(400).send({ message: 'Invalid email format' });
	}
}

module.exports.retrieveUserDetails = (req, res) => {

    return User.findById(req.user.id)
    .select('-password')
    .then(user => {

        if(!user){

            return res.status(404).send({ message: 'User not found' })

        } else{

            return res.status(200).send({ user : user });
        }  
    })
      .catch(error => errorHandler(error, req, res));
};