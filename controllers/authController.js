const connection = require ("../config/database");
const bcrypt = require ("bcrypt");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")


// User SignUp
exports.userSignUp = async(req, res) => {
   const {firstname, lastname, mail, phone,} = req.body;
   const q = `SELECT * FROM users WHERE phone="${phone}"` 
  
   connection.query(q, (err, results) => {
      if(!err){
         if(results.length <= 0){

        //Hash the password and create a user
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

         const q = `INSERT INTO users (firstname,lastname,mail,phone,password) VALUES ("${firstname}", "${lastname}","${mail}","${phone}","${hash}")`
         connection.query(q, (err, result) => {
            if(!err){
               return res.status(200).json({message: "You have registered Successfully"})
            }else{
               return res.status(400).json(err)
            }
         })
         }else{
            return res.status(400).json({message: "User already exist"})
         }
      }else{
         return res.status(500).json("Oops something occur")
      }
   })
}

  

   //  User Login
exports.userLogin = async(req, res)=>{

   //CHECK USER
   const {firstname} = req.body;

   let q = `SELECT * FROM users WHERE firstname = "${firstname}"`;

   connection.query(q, (err, data) => {
   if (err){ 
      return res.status(500).json(err)
   }else {
      if (data.length === 0) return res.status(404).json("User not found!");
   }

  //Check password
   const validPassword = bcrypt.compareSync(
      req.body.password, 
      data[0].password
   );

   if (!validPassword){
      return res.status(400).json("Wrong username or password!")
   }else if (validPassword===true){
      return res.status(200).json("User Login Successfully")
   }
  
      const token = jwt.sign({ id: data[0].id }, "jwtkey");
      const { password, ...other } = data[0];

      res.cookie("access_token", token, {
         httpOnly: true,
      })
      .status(200)
      .json(other);
   });
}


// User Logging Out
exports.userLogout = async(req, res) => {
   res.clearCookie("accessToken",{
      secure:true,
      sameSite:"none"
   }).status(200).json("User has been logged out.")
};


// Paystack Endpoint
exports.paystack = async(req, res)=>{
   const https = require('https')

   const params = JSON.stringify({
      "email": "odunadeahmed@gmail.com",
      "amount": "50000"
   })

   const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
         Authorization: 'Bearer sk_test_352552007c43874cc720eff86797bec8961f1e17',
         'Content-Type': 'application/json'
      }
   }

   const reqpaystack = https.request(options, respaystack => {
      let data = ''

      respaystack.on('data', (chunk) => {
         data += chunk
      });

      respaystack.on('end', () => {
         res.send(data)
         console.log(JSON.parse(data))
      })
   }).on('error', error => {
         console.error(error)
      })

   reqpaystack.write(params)
   reqpaystack.end()
}

// Creating variable for Transporter
let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth:{
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
   }
})


// User Payment Notification
exports.paymentNotification = async(req, res)=>{
   const users = req.body;
   const q = 'SELECT * FROM users WHERE mail =?'; 
   // connecting to db
   connection.query(q, [users.mail], (err, result) => {
      if(!err){ 
         if(result.length <=0){
            return res.status(200).json({message:"You've Successfully made your annual rent payment to Luli Fibre Telecoms"})
         }
         else{
            var mailOptions = { 
               from: process.env.EMAIL,
               to: result[0].mail, 
               subject: 'Welcome to Luli Fibre Telecomms', 
               html: '<p><b>Thank you, We have succesfully received your annual rent payment @ Luli Fibre Telecoms </b><br>Email: </b>'+result[0].mail+'<br></p> '
            }
            transporter.sendMail(mailOptions, function(error,info){
               if(error){
                  console.log(error) 
               }
               else{
                  console.log('Email sent: '+info.response)
               }
            })
            return res.status(200).json({message:"You've Successfully made your annual rent payment to Luli Fibre Telecomms"})      
         }
      }
      else{
         return res.status(404).json(err)
      }
   })
}

// Expiry date For your rent
exports.rentExpiryDate = async(req, res) => {
   const users = req.body;
   const q = 'SELECT * FROM users WHERE mail =?'; 
   // connecting to db
   connection.query(q, [users.mail], (err, result) => {
      if(!err){ 
         if(result.length <=0){
            return res.status(200).json({message:"Thank you for choosing Luli Fibre Telecoms, Your rent will be due to expire 365 days from now! "})
         }
         else{
         var mailOptions = { 
            from: process.env.EMAIL,
            to: result[0].mail, 
            subject: 'Welcome to Luli Fibre Telecomms', 
            html: '<p><b>Thank you, This is a reminder that your rent will due 365 days from now! </b><br>Email: </b>'+result[0].mail+'<br></p> '
         }
         transporter.sendMail(mailOptions, function(error,info){
            if(error){
               console.log(error) 
            }
            else{
               console.log('Email sent: '+info.response)
            }
         })
         return res.status(200).json({message:"Thank you for choosing Luli Fibre Telecoms, Your rent will be due to expire 365 days from now! "})      
      }
      }else{
         return res.status(404).json(err)
      }
   })
}

// Renewer Of Rent
exports.rentRenewer = async(req, res) => {
   const users = req.body;
   const q = 'SELECT * FROM users WHERE mail =?'; 
   // connecting to db
   connection.query(q, [users.mail], (err, result) => {
      if(!err){ 
         if(result.length <=0){
            return res.status(200).json({message:"Thank you for choosing Luli Fibre Telecoms, This is a quick reminder that your rent has expired"})
      }
      else{
         var mailOptions = { 
            from: process.env.EMAIL,
            to: result[0].mail, 
            subject: 'Welcome to Luli Fibre Telecomms', 
            html: '<p><b>Dear Occupant,<br> This is a reminder that your rent has expired, Please kindly make your payment through our Paystack platform @ Luli Fibre Telecomms<br>Thank you</b><br>Email: </b>'+result[0].mail+'<br></p> '
         }
         transporter.sendMail(mailOptions, function(error,info){
            if(error){
               console.log(error) 
            }
            else{
               console.log('Email sent: '+info.response)
            }
         })
            return res.status(200).json({message:"Thank you for choosing Luli Fibre Telecoms, This is a quick reminder that your rent has expired"})      
      
         }

      }
      else{
         return res.status(404).json(err)
      }
   })
}
// //STEP 1
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth:{
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD
//   }
// })

// // STEP 2
// let mailOptions = { 
//   from: process.env.EMAIL,
//   to: 'odunadeahmed89@gmail.com',   //result[0].mail,
//   subject: 'Password by Luli Fibre Telecomms',
//   html: "It Works Perfect"
// }

// // STEP 3
// exports.transporter.sendMail(mailOptions, function(err,info){
//   if(err){
//     console.log(err)
//   }else{
//     console.log('Email Sent')
//   }
// })

