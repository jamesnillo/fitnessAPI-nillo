const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports.createAccessToken = (user) => {
	
	const data = {
		id: user._id,
		email: user.email
	}
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {
		expiresIn: "1d"
	});

}

module.exports.verify = (req, res, next) => {
	

	let token = req.headers.authorization;

	if(token === undefined){
		return res.send({ auth: "Failed. No Token!"});
	}else {
		token = token.slice(7, token.length);

		console.log(token);

		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){
			if(err){
				return res.status(403).send({
					auth: "Failed",
					message: err.message
				})
			}else{
				console.log(decodedToken);

				req.user = decodedToken;
				
				next();

			}
		})

	}
}

module.exports.errorHandler = (err, req, res, next) => {
	console.error(err.code);

	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error';

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	})

}
