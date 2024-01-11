
import Order, { orderStatus } from '../../models/Order.js'
import Product from '../../models/Product.js'

export const createOrder = async (req, res) => {
    const loggedInUser = req.user

    req.body.products.map(async (product) => {
        const result = await Product.findById(product.product);
        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }
    })
    try {
        // TODO: create new order
        const newOrder = await new Order({
            orderByUser: loggedInUser._id,
            products: req.body.products,
            totalPrice: req.body.totalPrice,
        }).save()

        return res.status(201).json({
            message: 'Create order successfully',
            data: newOrder,
        })
    } catch (error) {
        return res.status(500).json({
            message: `${error.message || 'Something went wrong!'}`,
        })
    }
}

export const cancelOrder = async (req, res) => {
    const loggedInUser = req.user
    const { id } = req.params

    const foundOrder = await Order.findById({ _id: id })

    if (!foundOrder) {
        return res.status(400).json({
            message: 'Invalid Id, order not found.',
        })
    }

    try {
        // handle logic cancel for admin
        if (loggedInUser.role === "admin") {
            if (foundOrder.orderStatus === orderStatus.CANCELLED) {
                return res.status(422).json({
                    message: 'Order already cancelled.',
                })
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                {
                    orderStatus: orderStatus.CANCELLED,

                },
                { new: true }
            )

            return res.status(200).json({
                message: 'Cancel order successfully',
                data: updatedOrder,
            })
        } else {
            // handle logic cancel order for client'
            console.log(foundOrder.orderByUser == loggedInUser._id.toString())
            if (
                foundOrder.orderByUser == loggedInUser._id.toString()
            ) {
                const updatedOrder = await Order.findByIdAndUpdate(
                    { _id: id },
                    {
                        orderStatus: orderStatus.CANCELLED,

                    },
                    { new: true }
                )

                return res.status(200).json({
                    message: 'Cancel order successfully',
                    data: updatedOrder,
                })
            }
            return res.status(422).json({
                message: 'Invalid, Failed to cancel order.',
            })


        }
    } catch (error) {
        return res.status(500).json({
            error: `${error.message || 'Something went wrong!'}`,
        })
    }
}

export const getOrders = async (req, res) => {
    try {

        const { _page = 1, _limit = 10, _search } = req.query;
        const options = {
            page: _page,
            limit: _limit,
            sort: { createdAt: -1 },
            populate: [
                {
                    path: 'orderByUser',
                    select: '-password',

                },
                { path: 'products.product' },
            ],
        };
        const query = _search ? { name: { $regex: _search, $options: 'i' } } : {};
        const orders = await Order.paginate(query, options);
        if (!orders) {
            return res.status(400).json({ error: 'get all order failed' });
        }
        return res.status(200).json({
            message: "success",
            data: { ...orders }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

/* get order by id */
export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id).populate([
            {
                path: 'user',
                select: '-password '
            },
            {
                path: 'products.product',

            },
        ]);
        if (!order) {
            return res.status(400).json({ error: 'get order by id failed' });
        }
        return res.status(200).json({ order });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

/* cập nhật trạng thái đơn hàng */
export const updateStatus = async (id, status) => {
    try {
        const updateState = await Order.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        ).populate([
            {
                path: 'orderByUser',
                select: '-password',

            },
            { path: 'products.product' },
        ]);
        return updateState;
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}



export const getMyOrders = async (req, res) => {
    const loggedInUser = req.user

    const { _page = 1, _limit = 10, } = req.query;
    const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
        populate: [

            { path: 'products.product' },
        ],
    };

    try {
        const orders = await Order.paginate({ orderByUser: loggedInUser._id }, options);

        if (!orders) {
            return res.status(200).json({
                message: 'Success',
                data: [],
            })
        }

        return res.status(200).json({
            message: 'Success',
            data: orders,
        })
    } catch (error) {
        return res.status(500).json({
            error: `${error.message || 'Something went wrong!'}`,
        })
    }
}

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    if (!Object.values(orderStatus).includes(status)) {
        return res.status(400).json({
            message: 'Invalid status',
        })
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                $set: { 'orderStatus': status },
            },
            { new: true }
        )

        if (!updatedOrder) {
            return res.status(404).json({
                message: 'Order not found.',
            })
        }

        return res.status(200).json({
            message: 'Update order status successfully.',
            data: updatedOrder,
        })
    } catch (error) {
        return res.status(500).json({
            error: `${error.message || 'Something went wrong!'}`,
        })
    }
}
