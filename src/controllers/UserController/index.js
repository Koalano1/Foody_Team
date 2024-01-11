import { isEmail, isValidObjectId } from '../../utils/helper.js'
import User from '../../models/User.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config()


export const activateUser = async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        return res.status(400).json({
            message: 'This ID is invalid or not found.',
        })
    }

    try {
        const activatedUser = await User.findByIdAndUpdate(
            id,
            {
                isActive: true,
            },
            { new: true }
        )

        return res.status(200).json({
            message: 'Success',
            data: activatedUser,
        })
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong! ${error.message || ''}`,
        })
    }
}

export const deactivateUser = async (req, res) => {
    const { id } = req.params

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            message: 'This ID is invalid or not found.',
        })
    }

    try {
        const deactivatedUser = await User.findByIdAndUpdate(
            id,
            {
                isActive: false,
            },
            { new: true }
        )

        return res.status(200).json({
            message: 'Success',
            data: deactivatedUser,
        })
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong! ${error.message || ''}`,
        })
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            message: 'This ID is invalid or not found.',
        })
    }

    try {
        const user = await User.findByIdAndDelete(id)

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            })
        }

        return res.status(200).json({
            message: 'Success',
            data: user,
        })
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong! ${error.message || ''}`,
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const {
            _sort = 'createdAt',
            _order,
            _limit = 10,
            _page = 1,
        } = req.query
        const options = {
            page: _page,
            limit: _limit,
            sort: {
                [_sort]: _order !== 'desc' ? -1 : 1,
            },
        }

        const users = await User.paginate({}, options)
        if (users.length === 0) {
            return res.json({
                message: 'Không có user nào',
            })
        }
        /* loại bỏ password */
        users.docs.map((user) => {
            user.password = undefined
        })

        return res.status(200).json({
            message: 'Success',
            data: {
                users: users,
            },
        })
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong! ${error.message || ''}`,
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res
                .status(404)
                .json({ message: 'Không tìm thấy thông tin người dùng' })
        }
        user.password = undefined

        return res.status(200).json({
            message: 'Success',
            data: user,
        })
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong! ${error.message || ''}`,
        })
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            message: 'This ID is invalid or not found.',
        })
    }

    try {
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
            })
        }

        return res.status(200).json({
            message: 'Success',
            data: user,
        })
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong! ${error.message || ''}`,
        })
    }
}

export const updateAddress = async (req, res) => {
    const { address } = req.body
    const loggedInUser = req.user

    try {
        const updatedUser = await User.findByIdAndUpdate(
            loggedInUser.id,
            {
                address,
            },
            { new: true }
        )
        updatedUser.password = undefined

        return res.status(200).json({
            message: 'Success',
            data: updatedUser,
        })
    } catch (error) {
        return res.status(500).json({
            error: `${error.message || 'Something went wrong!'}`,
        })
    }
}

export const updateMe = async (req, res) => {
    try {
        const user = req.user

        const updatedUser = await User.findOneAndUpdate(
            { email: user.email },
            {
                userName: req?.body?.userName,
                mobile: req?.body?.mobile,
                address: req?.body?.address
            },
            {
                new: true,
            }
        )
        updatedUser.password = undefined

        return res.status(200).json({
            message: 'Success',
            data: updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong! ${error.message || ''}`,
        })
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params

    if (!isValidObjectId(id)) {
        return res.status(400).json({
            message: 'This ID is invalid or not found.',
        })
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            {
                userName: req?.body?.userName,
                address: req?.body?.address,
                mobile: req?.body?.mobile,
            },
            {
                new: true,
            }
        )
        updatedUser.password = undefined

        return res.status(200).json({
            message: 'Success',
            data: updatedUser,
        })
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong! ${error.message || ''}`,
        })
    }
}

export const createUser = async (req, res) => {
    const { userName, mobile, email, password: passwordName, address } = req.body

    const requiredFields = ['userName', 'email', 'password', "mobile"]

    requiredFields.forEach((field) => {
        if (!req.body[field]) {
            return res.status(400).json({
                message: `${field} is required`,
            })
        }
    })

    if (!isEmail(email || '')) {
        return res.status(400).json({
            message: 'Invalid email.',
        })
    }

    if (passwordName.length < 6 || passwordName.length > 100) {
        return res.status(400).json({
            message: 'Password length must be between 6-100.',
        })
    }
    try {
        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.status(422).json({
                message: 'Account is already exists.',
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(passwordName, salt);


        const newUser = await User.create({
            userName,
            email,
            address, mobile,
            password: hashPassword,
        })
        console.log(newUser, ":::")
        const { password, ...info } = newUser._doc;
        return res.status(201).json({
            message: 'Success',
            data: {
                user: info,
            },
        })
    } catch (error) {
        if ((error).message?.includes('mobile')) {
            return res.status(422).json({
                message: 'Phone number is already in use.',
            })
        }
        return res.status(500).json({
            message: `Something went wrong! ${error.message || ''}`,
        })
    }
}