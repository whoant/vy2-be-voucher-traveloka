const sendErrorDev = (err, res) => {
	res.status(err.statusCode || 500).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack
	});
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	} else {
		console.error('ERROR 💥', err);
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong !'
		});
	}
}

const handleError = (error, req, res, next) => {
	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(error, res);
	} else {
		sendErrorProd(error, res)
	}
};

module.exports = {
	handleError
};