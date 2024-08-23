import { Router } from "express";
import { deleteImage, getImages, uploadImage } from "../controllers/cursorImage.controller.js";
import { upload } from "../utils/multer.js";



const router = Router();


router.route("/upload").post(upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),uploadImage);




router.route("/get").post(getImages);

router.route("/delete").post(deleteImage);

export default router;
