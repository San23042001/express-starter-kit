//custom error class

class APIError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode
        this.name = 'APIError'; //set the error type to API error
    }
}


const asyncHandler = (fn) => (req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch(next)
}

const globalErrorhandler = (err, req, res, next) => {
    console.error(err.stack || err); // log everything for debugging

    // Default to 500 if no statusCode
    let statusCode = err.statusCode || 500;

    if (err instanceof APIError) {
        return res.status(statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    if (err && err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation Error'
        });
    }

    return res.status(statusCode).json({
        status: 'error',
        message: err?.message || 'An unexpected error occurred'
    });
};


module.exports = {APIError,asyncHandler,globalErrorhandler}