const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders/order/new
// @access  Private
exports.newOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo
    } = req.body;

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      user: req.user._id
    });

    const message = `Dear ${req.user.name},

Thank you for your order!

Order ID: ${order._id}
Total Amount: $${totalPrice.toFixed(2)}

Your order has been successfully placed and is now being processed.

You can track your order status by visiting the "My Orders" page in your account.

Shipping Address:
${shippingInfo.name}
${shippingInfo.address}
${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}
${shippingInfo.country}

Thank you for shopping with us!

Best regards,
May Store Team`;

    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Order Confirmation - May Store',
        message
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError.message);
    }

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/order/:id
// @access  Private
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/orders/me
// @access  Private
exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    let totalAmount = 0;
    orders.forEach(order => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      totalAmount,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update / Process order
// @route   PUT /api/orders/admin/order/:id
// @access  Private/Admin
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'You have already delivered this order'
      });
    }

    if (req.body.status === 'Shipped') {
      order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity);
      });
    }

    order.orderStatus = req.body.status;

    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/admin/order/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update product stock
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}





