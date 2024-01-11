// import * as cloudinary from 'cloudinary'

import { v2 as cloudinary } from 'cloudinary';
import config from './config.js';
import dotenv from 'dotenv';

dotenv.config();

// cloudinary.v2.config({
//   cloud_name: config().cloudinary.name,
//   api_key: config().cloudinary.apiKey,
//   api_secret: config().cloudinary.apiSecret,
// });

// export const uploadImageToCloud = async (fileToUpload) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.v2.uploader.upload(fileToUpload, (err, callResult) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve({
//         url: callResult?.secure_url || '',
//         public_id: callResult?.public_id || '',
//       });
//     });
//   });
// };

// export const deleteImageFromCloud = async (publicId) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.v2.uploader.destroy(publicId, (err, result) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve({
//         url: result?.secure_url || '',
//         public_id: result?.public_id || '',
//       });
//     });
//   });
// };

// export const deleteMultipleImagesFromCloud = async (images) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.v2.api.delete_resources(images, (err, result) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve({
//         result,
//       });
//     });
//   });
// };

// export const getAllImagesFromCloud = async () => {
//   return new Promise((resolve, reject) => {
//     cloudinary.v2.api.resources({ all: true }, (err, result) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve(result);
//     });
//   });
// };

export const cloudinaryConfig = cloudinary.config({
  cloud_name: 'dcwdrvxdg',
  api_key: '558211356134342',
  api_secret: 'udY2HfWNeQFfU0SbZ5sU6g8CN9M',
});
