import auth from './auth.js';
import cart from './cart.js';
import categoryRoutes from './category.routes.js';
import express from 'express';
import order from './order.js';
import productRoutes from './product.routes.js';
import uploadFile from './uploadFile.routes.js';
import uploadImage from './uploadImage.routes.js';
import user from './user.js';

const router = express.Router();

const rootRoutes = [auth, cart, order, uploadImage, user, categoryRoutes, productRoutes, uploadFile];

rootRoutes.map((route) => {
  router.use(route);
});

export default rootRoutes;
