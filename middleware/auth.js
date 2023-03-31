const jwt = require("jsonwebtoken");
const key = process.env.ACCESS_TOKEN_SECRET_TEXT;


authenticateToken = (req, res, next) => {
    const authHeader = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || token == "" || token == undefined) {
        return res.status(401).json({ error: true, message: "You're Logged Out, please login", authHead: req.headers, loggedOut: true });
    } else {

        jwt.verify(token, key, (err, phone) => {
            if (err) return res.status(403).json({ error: true, message: "Token invalid" });

            req.phone = phone;
            // console.log(req.phone);
            next();
        })
    }
}

userAuthenticateToken = (req, res, next) => {
    const authHeader = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || token == "" || token == undefined) {
        return res.status(401).json({ error: true, message: "You're Logged Out, please login", authHead: req.headers, loggedOut: true });
    } else {

        jwt.verify(token, userKey, (err, phone) => {
            if (err) return res.status(403).json({ error: true, message: "Token invalid" });

            req.phone = phone;
            // console.log(req.phone);
            next();
        })
    }
}

LogoutAuth = (req, res) => {
    const authHeader = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || token == "" || token == undefined) {
        return res.status(401).json({ error: true, message: "A token is required for authentication", authHead: req.headers });
    } else {
        const tokens = token + usersId();
        jwt.verify(tokens, key, (err, phone) => {
            if (err) return res.status(403).json({ error: true, message: "You're Logged Out, please login", loggedOut: true });

            req.phone = phone;
            next();
        })
    }
}

module.exports = authenticateToken , userAuthenticateToken