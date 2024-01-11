import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.js';
import { cloudinaryController } from '../controllers/CloudinaryController/uploadImage.controller.js';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';

dotenv.config();

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.CLOUDINARY_FOLDER_NAME,
    format: 'png', // supports promises as well
  },
});

const upload = multer({ storage: storage });

router.post('/images/upload', upload.array('images', 2), cloudinaryController.uploadImage);

export default router;
