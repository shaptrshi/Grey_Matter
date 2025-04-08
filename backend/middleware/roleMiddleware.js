const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                satisfies: false, 
                message: "Access denied",
        });
        }
        next();
    };
} 

module.exports = { authorizeRoles };