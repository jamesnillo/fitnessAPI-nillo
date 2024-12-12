const User = require('../models/User.js');
const bcrypt = require("bcrypt");
const Workout = require("../models/Workout");
const auth = require('../auth.js')

const { errorHandler } = auth;

module.exports.addWorkout = (req, res) => {
    const {name, duration, dateAdded, status} = req.body;

    const newWorkout = new Workout({
        userId: req.user.id,
        name: name,
        duration: duration
    })

    return Workout.findOne({name: name})
    .then(workoutExist => {
        if(workoutExist){
            return res.status(409).send({
                message: "Workout name already exist",

            });
        }else{
            return newWorkout.save()
            .then(result => {
                res.status(201).send(result)
            })
            .catch(error => errorHandler(error, req, res))
        }

    })
    .catch(error => errorHandler(error, req, res))
}

module.exports.getMyWorkouts = (req,res) => {
    
    return Workout.find({userId: req.user.id})
    .then(result => {
        
        if(result.length > 0){
        
            return res.status(200).send({"workouts": result});
        }else {
            return res.status(404).send({message: 'No found workouts'});
        }
    })
    .catch(error => errorHandler(error,req,res));
}



module.exports.updateWorkout = (req, res)=>{

    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration
    }

    return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout, {new:true})
    .then(workout => {
        if (workout) {
            res.status(200).send({
                message: "Workout updated successfully",
                "updatedWorkout" :workout
            });
        } else {
            res.status(404).send({message: 'Workout not found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.deleteWorkout = (req, res) => {
    const workoutId = req.params.workoutId;

    return Workout.findByIdAndDelete(workoutId)
        .then(workout => {
            if (workout) {
                return res.status(200).send({
                    message: "Workout deleted successfully"
                });
            } else {
                return res.status(404).send({ message: "Workout not found" });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.completeStatus = (req, res) => {
    const updateStatusField = { status: "completed" };

    Workout.findById(req.params.workoutId)
        .then(workout => {
            if (!workout) {
                return res.status(404).send({ message: "Workout not found" });
            }

            if (workout.status === "completed") {
                return res.status(200).send({
                    message: "Workout already completed",
                });
            }

            return Workout.findByIdAndUpdate(req.params.workoutId, updateStatusField, { new: true })
                .then(updatedWorkout => {
                    return res.status(200).send({
                        message: "Workout status updated successfully",
                        updatedWorkout
                    });
                });
        })
        .catch(error => {
            errorHandler(error, req, res);
        });
};