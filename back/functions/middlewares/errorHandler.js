export const errorHandler = (err, _req, res) => {
	const code = err.statusCode || 500
	res.status(code).json({
		success: false,
		status: code,
		message: err.message || "Internal server error"
	})
}
