import { error } from "console";
import { CursorImage } from "../models/cursorimges.model.js";
import { User } from "../models/user.model.js";
import { checkNullUndefined } from "../utils/tools.js";
import fs from "fs"


const uploadImage =  async (req, res) => {
    const { userid, imagebase64 } = req.body;
    
    // console.log(req.files.image[0]);
    if (checkNullUndefined(userid) ) {
      return res.status(400).json({ error: "invalid credentials null" })
    }
    try {

        const user = await User.findOne({
        $or: [{"_id":userid }]
        })

        if(!user){
            return res.status(400).json({
                status: "Failed",
                message: "user does not exists"
              });
        }

        // const cursorImage = new CursorImage();
        // cursorImage.userid = userid;
        // cursorImage.baseModelName = imagebase64;
        // cursorImage.image.data = fs.readFileSync(req.files.image[0].path);
        // cursorImage.image.contentType= req.files.image[0].mimetype;
       
        // cursorImage.save();


        const cursorImage = await CursorImage.create({
          userid,
          imagebase64
         })

         const createdcursorImage = await CursorImage.findById(cursorImage._id)

         if(!createdcursorImage){
          return res.status(400).json({
              status: "Failed",
              message: "something went wrong"
            });
        }

        

        
        

        
        
        
      res.status(201).json({ message: 'image uploded successfully' , body : createdcursorImage});
    } catch (error) {
      console.error('Error signing up user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  const getImages = async (req, res) => {
    const { userid } = req.body;
  
    if (!userid) {
      return res.status(400).json({ error: "Invalid credentials: userid is null or undefined" });
    }
  
    try {
      // Fetch the user by ID
      const user = await User.findById(userid);
      if (!user) {
        console.log('User not found');
        return res.status(404).json({
          status: "Failed",
          message: "User does not exist"
        });
      }
  
      // Fetch images associated with the user
      const images = await CursorImage.find({ userid });
      console.log(images);
      res.status(200).json({ message: "success", body: images });
    } catch (e) {
      console.error("Error getting images:", e);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  const deleteImage = async (req,res) =>{
    const {cursorImageid} = req.body;
    if (!cursorImageid) {
      return res.status(400).json({ error: "Invalid credentials: cursorImageid is null or undefined" });
    }


    try {
      const cursorImage = await CursorImage.findById(cursorImageid);
      if (!cursorImage) {
        console.log('CursorImage not found');
        return res.status(404).json({
          status: "Failed",
          message: "CursorImage does not exist"
        });
      }
      
      
      cursorImage.userid = '66c8601eac78bd1fdd7b8a6a';
      await cursorImage.save();
      
      res.status(200).json({ message: "success" });
    } catch (e) {
      console.error("Error getting images:", e);
      res.status(500).json({ error: 'Internal Server Error' });
    }


  }

export {
  uploadImage,
  getImages,
  deleteImage
}
