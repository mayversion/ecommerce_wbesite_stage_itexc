# E-Commerce Website

A full-featured e-commerce platform built with MERN stack (MongoDB, Express.js, React.js, Node.js) with modern UI/UX and robust backend functionality.

## Features

- **User Authentication**
  - User registration and login
  - Password reset functionality
  - User profile management

- **Product Management**
  - Browse products with filters and search
  - Product categories and details
  - Product reviews and ratings

- **Shopping Experience**
  - Shopping cart functionality
  - Secure checkout process
  - Order history and tracking

- **Admin Dashboard**
  - Product management (CRUD operations)
  - User management
  - Order processing
  - Sales analytics

## Technology Stack

- **Frontend**: React.js, Redux, Material-UI, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Integration**: Stripe
- **Cloud Storage**: Cloudinary for image uploads
- **Deployment**: Vercel (Frontend), Render (Backend)

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for image uploads)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mayversion/ecommerce_wbesite_stage_itexc.git
   cd ecommerce_wbesite_stage_itexc
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` in both `backend` and `frontend` directories
   - Update the environment variables with your configuration

4. **Start the application**
   ```bash
   # Start backend server
   cd backend
   npm run dev
   
   # In a new terminal, start frontend
   cd frontend
   npm start
   ```

## Environment Variables

### Backend (`.env` in `backend` directory)
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_API_VERSION=2020-08-27
```

### Frontend (`.env` in `frontend` directory)
```
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run data:import` - Import sample data
- `npm run data:destroy` - Destroy sample data

### Frontend
- `npm start` - Start the development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from create-react-app

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**mayversion**
- GitHub: [@mayversion](https://github.com/mayversion)
- Email: maymehenni1@gmail.com

## Acknowledgments

- Thanks to all contributors who have helped shape this project.
- Special thanks to the open-source community for the amazing tools and libraries.
