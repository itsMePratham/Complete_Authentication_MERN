const User = require("../Model/user.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

 const{generateTokenAndSetCookies} = require("../Utils/generateTokenAndSetCookies")
 const{sendVerificationEmail ,sendWelcomeEmail ,sendPasswordResetEmail ,sendResetSuccessEmail} = require("../mailtrap/email")

const signup = async (req, res) => {

      console.log(req.body);
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24hours
    });

    await user.save();

    //jwt
    generateTokenAndSetCookies(res ,user._id);

    await sendVerificationEmail(user.email , verificationToken);
      res.status(201).json({

        success:true,
        message:"user created Successfully",
        user:{

            ...user._doc,
            password: undefined
        }
      })


  } catch (error) {
    console.log("yaha hai");
    res.status(400).json({ success: false, message: error.message });
  }
};


const verifyUser = async(req,res )=>{

   try{
    const {code} = req.body;

   const user =  await User.findOne({
     verificationToken:code,
     verificationTokenExpiresAt:{$gt:Date.now()}
   })
  
    
   if(!user){

    return res.status(400).json({success:false ,message:"Invalid or expired Verification Code"})
   }

    user.isVerified = true;
    user.verificationToken= undefined;
    user.verificationTokenExpiresAt=undefined;

    await user.save();

     await sendWelcomeEmail(user.email , user.name);

      res.status(200).json({

        success:true,
        message:"user verified",
        user:{

            ...user._doc,
            password: undefined
        }
      })
     

   }catch(error){


      console.log("verification main dikkat hai");
    res.status(400).json({ success: false, message: error.message });



   }


}

const login = async (req, res) => {
    const{email, password} = req.body;

     try{

        const user = await User.findOne({email});

        if(!user)
        {

         return res.status(400).json({
          success:false ,
          message:"Invalid email credentials"
         });
        }

       const isPasswordValid = await bcrypt.compare(password ,user.password);

       if(!isPasswordValid)
       {
        return res.status(400).json({success:false ,
          message:"Invalid Password Credentials"
        });
       }

         generateTokenAndSetCookies(res , user._id);

         user.lastLogin = Date.now();
         await user.save();
         res.status(200).json({

        success:true,
        message:"user loggedin successfully",
        user:{

            ...user._doc,
            password: undefined
        }
      })


     }catch(error)
     {
        console.log("Login mai dikkat hai");
        res.status(400).json({

          success: false ,
          message:error.message
        })
        
     }







};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({

    message:"Logged out successfully"
  })
};

const forgotPassword = async(req , res)=>{

    const {email} = req.body;

    try{

     const user = await User.findOne({email});

     if(!user)
     {

          return res.status(400).json({

            success: false ,
            message : "Invalid Email credentials"
          })

     }

       //generate reset token 

         const resetToken = crypto.randomBytes(20).toString("hex");

        const resetTokenExpireAt = Date.now()+ 1*60*60*1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpireAt;
        
        await user.save();

        await sendPasswordResetEmail(user.email , `${process.env.CLIENT_URL}/reset-password/${resetToken}`);


        res.status(200).json({success:true , message:"Password reset link sent to your email"})

    }catch(error){

      console.log("Reset password main dikkat hai");
        res.status(400).json({

          success: false ,
          message:error.message
        })

    }


}

const resetPassword  =async(req , res )=>{

    const {new_password} = req.body

   try{

    const {token} = req.params;

    const user = await User.findOne({
      resetPasswordToken:token,
      resetPasswordExpiresAt:{$gt :Date.now()}
    });


    if(!user)
    {
      res.status(400).json({

        success:false,
        message: "User With this token is not indentified"
      })
    }
         const hashedPasswordReset = await bcrypt.hash(new_password,10);
    user.password = hashedPasswordReset;
    user.resetPasswordExpiresAt= undefined;
    user.resetPasswordToken= undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

      res.status(200).json({success:true , message:"Password Reset Successfully!"})

   }catch(error){
       console.log("Reset new_password password main dikkat hai");
        res.status(400).json({

          success: false ,
          message:error.message
        })
   }

}


const checkAuth = async(req , res)=>{

  try{

       const user = await User.findById(req.userId);

  if(!user)
  {
     return res.status(400).json({

      success:false,
      message:"User not Found"
     });
  }

   res.status(200).json({
    success: true,
    message : "Authorised User"
    
   })




  }
  catch(error){

     console.log('Error in checkAuth', error);
     res.status(400).json({

      success:false,
      message:error.message
     });

  }
}

module.exports = {
  signup,
  verifyUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth
};
