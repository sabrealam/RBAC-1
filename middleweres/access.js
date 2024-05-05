




function access(roles){

    return async function(req,res,next){
        // console.log(req.user.data.user.role)
        if(roles.includes(req.user.data.user.role)) {
            return next();
        }
        res.status(401).send({error : "Authentication Failed" , messag : `You don't have access to this route Based on your role`});

    }
}

module.exports = access