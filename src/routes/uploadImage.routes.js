import * as dotenv from 'dotenv';

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryConfig } from '../utils/cloudinary.js';
import { cloudinaryController } from '../controllers/CloudinaryController/uploadImage.controller.js';
import express from 'express';
import multer from 'multer';

dotenv.config();

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryConfig,
  params: {
    folder: process.env.CLOUDINARY_FOLDER_NAME,
  },
});

const upload = multer({ storage: storage });

router.post('/upload-images', upload.array('images', 2), cloudinaryController.uploadImage);

export default router;
