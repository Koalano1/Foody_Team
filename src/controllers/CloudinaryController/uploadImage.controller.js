import cloudinary from '../../configs/cloudinary.js';

export const cloudinaryController = {
  /* upload image */
  uploadImage: async (req, res) => {
    try {
      const files = req.files;
      if (!Array.isArray(files)) {
        return res.status(400).send({ message: 'File is not correct' });
      }
      const uploadPromises = files.map((file) => {
        return cloudinary.uploader.upload(file.path);
      });
      const results = await Promise.all(uploadPromises);
      const uploadedFiles = results.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      }));
      return res.status(200).send({ url: uploadedFiles[0].url });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
