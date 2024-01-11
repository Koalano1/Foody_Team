export default () => {
  return {
    port: process.env.PORT ?? 4001,
    mongoDBURI: process.env.MONGODB_URI,

    cloudinary: {
      name: process.env.CLOUDINARY_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
  }
}
