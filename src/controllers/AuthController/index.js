import User from '../../models/User.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { isEmail } from '../../utils/helper.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const generateToken = async (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
  return token;
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!isEmail(email || '')) {
    return res.status(400).json({
      message: 'Invalid email.',
    });
  }

  if (!password || password.length < 6 || password.length > 100) {
    return res.status(400).json({
      message: 'Password length must be between 6-100.',
    });
  }

  try {
    /* check email */
    const emailExits = await User.findOne({ email: email });

    if (!emailExits) {
      return res.status(400).json({ message: 'Email does not exist' });
    }
    /* check password */
    const validPassword = await bcrypt.compare(password, emailExits.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    if (emailExits && validPassword) {
      const token = await generateToken(emailExits);
      console.log('🚀 ~ file: index.js:44 ~ login ~ token:', token);
      /* remove password */
      const { password, ...info } = emailExits._doc;

      return res.status(200).json({
        message: 'Success',
        data: {
          user: { ...info, accessToken: token },
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Something went wrong. ${error.message}`,
    });
  }
};

// register
export const register = async (req, res) => {
  const { userName, email, passwordName } = req.body;

  const requiredFields = ['userName', 'email', 'passwordName'];
  console.log(req.body);
  requiredFields.forEach((field) => {
    if (!req.body[field]) {
      return res.status(400).json({
        message: `${field} is required`,
      });
    }
  });

  if (!isEmail(email || '')) {
    return res.status(400).json({
      message: 'Invalid email.',
    });
  }

  if (passwordName.length < 6 || passwordName.length > 100) {
    return res.status(400).json({
      message: 'Password length must be between 6-100.',
    });
  }

  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(422).json({
        message: 'Account is already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(passwordName, salt);

    console.log(salt);

    const newUser = await User.create({
      userName,
      email,

      password: hashPassword,
    });
    console.log(newUser, ':::');
    const { password, ...info } = newUser._doc;
    return res.status(201).json({
      message: 'Success',
      data: {
        user: info,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: `Something went wrong, ${error.message}`,
    });
  }
};
