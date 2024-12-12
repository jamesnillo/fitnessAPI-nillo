const express = require("express");
const workoutController = require('../controllers/workout.js')
const { verify } = require("../auth.js");

const router = express.Router();

router.post("/addWorkout", verify, workoutController.addWorkout);

router.get('/getMyWorkouts', verify, workoutController.getMyWorkouts);

router.patch("/updateWorkout/:workoutId", verify, workoutController.updateWorkout);

router.delete("/deleteWorkout/:workoutId", verify, workoutController.deleteWorkout);

router.patch("/completeWorkoutStatus/:workoutId", verify, workoutController.completeStatus);






module.exports = router;