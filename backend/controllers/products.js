const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const resPerPage = 8;
    const page = parseInt(req.query.page) || 1;
    const skip = resPerPage * (page - 1);

    // Do not hide imported items: show all unless explicitly set to false
    let query = { isActive: { $ne: false } };

    // Filter by category
    if (req.query.category) {
      const c = String(req.query.category).toLowerCase();
      // Option B: map UI families to dataset category names using keyword regex
      const familyRegex = {
        electronics: /(electronics|electronic|camera|photo|computer|laptop|desktop|pc|monitor|printer|scanner|phone|cell|mobile|smart|tablet|tv|television|audio|speaker|headphone|earbud|console|gaming|router|network|storage|ssd|hdd|wearable)/i,
        clothing: /(clothing|clothes|apparel|fashion|men|women|boys|girls|kids|shoes|sneaker|boot|sandals|watches|jewelry|handbag|bags|accessories|uniforms)/i,
        home: /(home|household|kitchen|dining|cookware|bakeware|appliance|vacuum|cleaning|furniture|sofa|chair|table|decor|dec[oô]r|bedding|bath|lighting|lamp|storage|organization|seasonal|tools|paint|fixtures|ceiling fans|garden|outdoor)/i,
        sports: /(sport|sports|outdoor recreation|outdoor|fitness|exercise|workout|yoga|camping|hiking|bicycle|bike|helmet|ball|soccer|basketball|tennis|golf|swim|running|nutrition)/i
      };

      if (familyRegex[c]) {
        query.category = { $regex: familyRegex[c] };
      } else {
        // Exact dataset category name
        query.category = req.query.category;
      }
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseInt(req.query.maxPrice);
      }
    }

    // Filter by rating
    if (req.query.rating) {
      query.ratings = { $gte: parseInt(req.query.rating) };
    }

    // Search by name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Sort
    let sortBy = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          sortBy.price = 1;
          break;
        case 'price-high':
          sortBy.price = -1;
          break;
        case 'rating':
          sortBy.ratings = -1;
          break;
        case 'newest':
          sortBy.createdAt = -1;
          break;
        default:
          sortBy.createdAt = -1;
      }
    } else {
      sortBy.createdAt = -1;
    }

    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(resPerPage)
      .maxTimeMS(5000)
      .lean();

    const totalProducts = await Product.countDocuments(query).maxTimeMS(5000);
    const totalPages = Math.ceil(totalProducts / resPerPage);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products,
      // Frontend expects these names
      productsCount: totalProducts,
      resPerPage,
      filteredProductsCount: totalProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get distinct categories
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const cats = await Product.distinct('category');
    cats.sort((a, b) => String(a).localeCompare(String(b)));
    return res.status(200).json({ success: true, categories: cats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    // Handle images if provided (supports base64 data URLs or direct URLs)
    let images = [];
    if (Array.isArray(req.body.images) && req.body.images.length > 0) {
      for (const img of req.body.images) {
        if (typeof img === 'string' && img.startsWith('data:')) {
          // Base64 image -> upload to Cloudinary
          const uploadRes = await cloudinary.uploader.upload(img, {
            folder: 'may_store/products'
          });
          images.push({ public_id: uploadRes.public_id, url: uploadRes.secure_url });
        } else if (typeof img === 'string' && img.startsWith('http')) {
          // Existing URL
          images.push({ url: img });
        }
      }
    }

    if (images.length) {
      req.body.images = images;
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    // Optional: process new images if provided
    if (Array.isArray(req.body.images) && req.body.images.length > 0) {
      let newImages = [];
      for (const img of req.body.images) {
        if (typeof img === 'string' && img.startsWith('data:')) {
          const uploadRes = await cloudinary.uploader.upload(img, {
            folder: 'may_store/products'
          });
          newImages.push({ public_id: uploadRes.public_id, url: uploadRes.secure_url });
        } else if (typeof img === 'string' && img.startsWith('http')) {
          newImages.push({ url: img });
        } else if (img && img.public_id && img.url) {
          newImages.push(img);
        }
      }
      req.body.images = newImages;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Product already reviewed'
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;

    // Calculate average rating
    const totalRatings = product.reviews.reduce((acc, item) => acc + item.rating, 0);
    product.ratings = totalRatings / product.reviews.length;
    
    // Round to one decimal place for cleaner display
    product.ratings = Math.round(product.ratings * 10) / 10;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const reviews = product.reviews.filter(
      review => review._id.toString() !== req.params.reviewId.toString()
    );

    const numOfReviews = reviews.length;

    const ratings = numOfReviews === 0 ? 0 : product.reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

    await Product.findByIdAndUpdate(req.params.id, {
      reviews,
      ratings,
      numOfReviews
    }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};





