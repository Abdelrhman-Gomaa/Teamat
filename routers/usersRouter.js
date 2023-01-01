const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authCheck = require('../middleware/authCheck')
const isAdmin = require('../middleware/isAdmin')
const nodemailer = require("nodemailer");
const CodeGenerator = require("node-code-generator");
const passport = require('passport')
const passportConfig = require("../passport");

const router = express.Router()

// featch all users
router.get('/user', authCheck, isAdmin, async (req, res) => {
    const user = await User.findAll({include: {all: true}}) //{include: Player}
        .then(result =>{
            res.status(200).json({
                message: 'Object find Successfully',
                user: result
            });
            console.log(result)
        }).catch((error) => {  
            console.log('error', error)
            res.status(500).json({
                error: error.message
            })
        })
})

// Registeration ..............
// default regist
router.post('/register', async (req, res) => {
    let user = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if(user) return res.status(400).json({ message: `Error: this '${req.body.email}' is already Register` })

    bcrypt.hash(req.body.password,10, async(err, hash) =>{
        if(err){
            return res.status(500).json({
                error: err
            });
        }else{
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                isAdmin: req.body.isAdmin,
                nation: req.body.nation,
                phoneNumber: req.body.phoneNumber
            })
                .then(result =>{
                    res.status(201).json({
                        message: 'User Registeration Successfully',
                        user: result
                    });
                    console.log(result)
                }).catch((error) => {  
                    console.log('error', error)
                    res.status(500).json({
                        error: error.message
                    })
                })
        }
    })
})
// Register New User by Google
router.post(
    "/Oauth/google",
    passport.authenticate("googleToken", { session: false }),
    async (req, res, next) => {
        let user = await User.findOne({ where: {email: req.user.email }});
        if (!user) return res.status(404).send("Invalid email");
      
        var generator = new CodeGenerator();
        const code = generator.generateCodes("#+#+#+", 100)[0];
      
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });
      
        var mailOptions = {
          from: process.env.EMAIL,
          to: req.body.email,
          subject: "Verfication Code",
          text: `Reset password code ${code}`,
        };
      
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            res.status(400).send(error);
          } else {
            req.body.codeVerifing = code;
            await user.set(req.body).save();
            res.status(200).send(`Email sent: ${info.response}`);
          }
        });
        
    }
);
// Register New User by Facebook
router.post(
    "/Oauth/facebook",
    passport.authenticate("facebookToken", { session: false }),
    async (req, res, next) => {
        let user = await User.findOne({ where: {email: req.user.email }});
        if (!user) return res.status(404).send("Invalid email");
      
        var generator = new CodeGenerator();
        const code = generator.generateCodes("#+#+#+", 100)[0];
      
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });
      
        var mailOptions = {
          from: process.env.EMAIL,
          to: req.body.email,
          subject: "Verfication Code",
          text: `Reset password code ${code}`,
        };
      
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            res.status(400).send(error);
          } else {
            req.body.codeVerifing = code;
            await user.set(req.body).save();
            res.status(200).send(`Email sent: ${info.response}`);
          }
        });
        
    }
);

// Login
router.post('/login', async(req,res) => {
    await User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then((user) => {
            if(!user) return res.status(404).json({ message: `Error: this '${req.body.email}' is Not Found` })
            bcrypt.compare(req.body.password, user.password, async(err, result) => {
                if(err){
                    return res.status(401).json({
                        message: "Auth Faild ..."
                    });
                }
                if(result){
                    const alreadyToken = req.header('Authorization')
                    if (alreadyToken) return res.status(401).send('Access Denaied ... This account aleardy Login')
                    else{
                        const token = jwt.sign(
                            {_id: user._id, email: user.email},
                            process.env.JWT,
                            {expiresIn: "24h"}
                        );
                        res.header('Authorization',token)
                            return res.status(200).json({
                                message: 'You are Login Now...'
                            });
                    }
                }
                res.status(401).json({
                    message: 'Password is Incorrect...'
                });
            })
        })
        .catch((error) => {  
            console.log('error', error)
            res.status(500).json({
                error: error.message
            })
        });
})

// delete User 
router.delete('/user/:id', authCheck, isAdmin, async(req, res) => {
    let user = await User.findOne({
        where: {
            id: req.params.id
        }
    })
    if(!user) return res.status(404).json({ message: `Error this '${req.params.id}' Not Found` })

    user.destroy({
        where: {
            id: req.params.id
        }
        // to delete All Table 
        // truncate: true
    })
    .then(result =>{
        res.status(201).json({
            message: 'Object Deleted Successfully'
        })
    }).catch((error) => {  
        console.log('error: .', error)
        res.status(500).json({
            error: error.message
        })
    })
})

// Open Your Profile
router.get("/profile", authCheck, async (req, res, next) => {
    try {
      const user = await User.findOne({ where: {email: req.user.email }});
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
});

// Change your Password
router.post("/changePassword", authCheck, async (req, res, next) => {
    try {
      const compare = await bcrypt.compare(
        req.body.oldPassword,
        req.user.password
      );
      if (!compare) return res.status(400).send("Incorrect password");
  
      req.user.password = await bcrypt.hash(req.body.newPassword, 10);
      req.user = await req.user.save();
      res.status(200).send(req.user);
    } catch (error) {
      next(error);
    }
});

// Forget Password Methods
// Send Code Verify
router.post("/sendCode", async (req, res, next) => {
    let user = await User.findOne({where:{ email: req.body.email }});
    if (!user) return res.status(404).send("Invalid email");
  
    var generator = new CodeGenerator();
    const code = generator.generateCodes("#+#+#+", 100)[0];
  
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  
    var mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Verfication Code",
      text: `Reset password code ${code}`,
    };
  
    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        res.status(400).send(error);
      } else {
        req.body.codeVerifing = code;
        await user.set(req.body).save();
        res.status(200).send(`Email sent: ${info.response}`);
      }
    });
    
});
// Code Verifing
router.post("/verifyCode", async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User with the given email not exits");
    }
  
    try {
      if (user.codeVerifing == req.body.code) {
        user.enabled = true;
        user.codeVerifing = "";
        user = await user.save();
        res.status(200).send(user);
      }
    } catch (error) {
      next(error);
    }
});

// Forget Your Password
router.post("/forgetPassword", async (req, res, next) => {
    try {
      let user = await User.findOne({where: { email: req.body.email }});
      if (!user) return res.status(404).send("Invalid email");
  
      if (user.codeVerifing === req.body.code) {
        user.password = await bcrypt.hash(req.body.newPassword, 10);
        user.codeVerifing = "";
        user = await user.save();
        res.status(200).send(user);
      }
    } catch (error) {
      next(error);
    }
});

// Edit Profile (Update)
router.patch("/edit", authCheck, async (req, res, next) => {
    let user = await User.findOne({
        where: {
            email: req.params.emial
        }
    })
    if(!user) return res.status(404).json({ message: `Invalid email` })

    user.update({
        name: req.body.name,
        nation: req.body.nation,
        phoneNumber: req.body.phoneNumber
    },
    {
        where: {
            email: req.params.email
        }
    }).then(result =>{
        res.status(201).json({
            message: 'Object Updated Successfully',
            TeamUpdated: result
        });
        console.log(result)
    }).catch((error) => {  
        console.log('error: .', error)
        res.status(500).json({
            error: error.message
        })
    })
});


module.exports = router