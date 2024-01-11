import jwt from 'jsonwebtoken'

import User from '../models/User.js'


import dotenv from "dotenv";
dotenv.config()

export const auth = async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers?.authorization?.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);




      const user = await User.findById(decoded?._id);

      req.user = user;
      next();
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(200).json({
          message: 'Token không hợp lệ',
          err,
        });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({
          message: 'Token hết hạn',
          err,
        });
      }

      return res.status(400).json({
        message: 'Token không hợp lệ',
      });
    }
  } else {
    return res.status(400).json({
      message: 'Không có token',
    });
  }
};

export const isAdmin = async (req, res, next) => {
  const user = req.user;

  if (user?.role === 'admin') {
    return next();
  }

  return res.status(401).json({
    message: 'You are not an admin, permission denied.',
  });
};
