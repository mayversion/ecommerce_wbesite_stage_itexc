const User = require('../models/User');

// @desc    Add address
// @route   POST /api/users/address
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If this is the first address, set it as default
    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update address
// @route   PUT /api/users/address/:id
// @access  Private
exports.updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const addressIndex = user.addresses.findIndex(
      address => address._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...req.body };
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/address/:id
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const addressIndex = user.addresses.findIndex(
      address => address._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If deleted address was default, set first remaining address as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Set default address
// @route   PUT /api/users/address/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove default from all addresses
    user.addresses.forEach(address => {
      address.isDefault = false;
    });

    // Set the selected address as default
    const addressIndex = user.addresses.findIndex(
      address => address._id.toString() === req.params.id
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    user.addresses[addressIndex].isDefault = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      addresses: user.addresses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};





