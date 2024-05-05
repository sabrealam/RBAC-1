require("dotenv").config();
const jwt = require("jsonwebtoken");


async function auth(req, res, next) {
    let {name ,  email, password , role } = req.body
    try {
        let token = req.headers.authorization.split(` `)[1];
        if(!token) return res.status(401).send({message : "Token not found"});

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if(err) return res.status(401).send({message : "Unauthorized"});

            req.user = user
            next()
        })
        
    } catch (error) {
        res.status(401).send("Unauthorized")
    }
}


module.exports = auth