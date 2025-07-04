const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next)=>{

     const token = req.cookies.token;
     if(!token)
     {
        return res.status(400).json({
            success:  false,
            message:"Unauthorised no token provided"
        })
     }


     try{

        const decoded = jwt.verify(token ,process.env.JWT_SECRET);

        if(!decoded)
        {

            return res.status(400).json({

                success: false,
                message: "Unauthorised-invalid token"
            })
        }

        req.userId = decoded.userId;
        next();

     }


     catch(error)
     {
          console.log("Errorin verifying Token", error);
          return res.status(500).json({
            success: false ,
            message:"server error(in token middleWare)"
          })
     }

}




module.exports={
    verifyToken
}