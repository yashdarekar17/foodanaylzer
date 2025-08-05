

const jwt = require('jsonwebtoken');

const jwtauthentication = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ message: "Token not found" });
    }

    const token = authorization.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({ message: "Token not found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('JWT Verification Error:', err);
        return res.status(401).json({ message: "Invalid token" });
    }
};





const genratetoken = (userdata)=>{
    return jwt.sign(userdata,process.env.SECRET_KEY,{expiresIn:"2d"});

}

module.exports = {jwtauthentication,genratetoken};