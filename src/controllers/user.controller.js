import {User} from "../models/user.model.js";
import { checkNullUndefined } from "../utils/tools.js";
import axios from "axios"
import bcrypt from "bcrypt"
import { docs } from "googleapis/build/src/apis/docs/index.js";
const registerUser =  async (req, res) => {
    const { name, email ,password } = req.body;
    
    if (checkNullUndefined(name) ||checkNullUndefined(email)|| checkNullUndefined(password)) {
      return res.status(400).json({ error: "invalid credentials null" })
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid email address entered."
      });
    }

    try {

        const existedUser = await User.findOne({
        $or: [{name },{email}]
        })

        if(existedUser){
            return res.status(400).json({
                status: "Failed",
                message: "user already registered"
              });
        }

        let passwordcrpted = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: passwordcrpted,
        })
        const createdUser = await User.findById(user._id).select(
            "-password"
        )

        if(!createdUser){
            return res.status(400).json({
                status: "Failed",
                message: "something went wrong"
              });
        }
      res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
      console.error('Error signing up user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


 const loginUser =  async (req, res) => {
    const { email, password } = req.body;

    if(checkNullUndefined(email) || checkNullUndefined(password)){
        return res.status(400).json({ error: "invalid credentials" });
    }

    try {
        
    
      const user = await User.findOne({
        $or: [{email}]
        })
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // console.log("login auth")
      // await login(email);
      // console.log("login auth2")


      bcrypt.compare(req.body.password, user.password, function (err, response) {
        if (response) {
          res.status(200).json({ message: 'User logged in successfully', body: user });
        } else {
          // response is OutgoingMessage object that server response http request
          return res.status(400).json({ success: false, message: 'passwords do not match' });
        }
      });



    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }



export {
    registerUser,
    loginUser,
   
   
}
