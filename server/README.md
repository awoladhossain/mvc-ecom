# Server for E-commerce Project

This is the server side of the e-commerce project. It is built using Node.js, Express.js and MongoDB.

## Features

* User authentication and authorization
* Product management (CRUD operations)
* Order management (CRUD operations)
* Payment gateway integration (Stripe)
* Cloudinary integration for image upload and storage

## Installation

* Clone the repository
* Run `pnpm install` to install the dependencies
* Create a `.env` file and add the environment variables (see `.env.example`)
* Run `pnpm start` to start the server

## API Endpoints

### User

* `POST /user/signup` - Register a new user
* `POST /user/login` - Login an existing user
* `GET /user/me` - Get the current user
* `PUT /user/me` - Update the current user
* `DELETE /user/me` - Delete the current user

### Product

* `GET /product` - Get all products
* `GET /product/:id` - Get a product by id
* `POST /product` - Create a new product
* `PUT /product/:id` - Update a product by id
* `DELETE /product/:id` - Delete a product by id

### Order

* `GET /order` - Get all orders
* `GET /order/:id` - Get an order by id
* `POST /order` - Create a new order
* `PUT /order/:id` - Update an order by id
* `DELETE /order/:id` - Delete an order by id

### Payment

* `POST /payment` - Process a payment using Stripe

### Image

* `POST /image` - Upload an image to Cloudinary

## Environment Variables

The following environment variables are required:

* `MONGO_URI` - The MongoDB connection URI
* `STRIPE_SECRET_KEY` - The Stripe secret key
* `STRIPE_PUBLIC_KEY` - The Stripe public key
* `CLOUDINARY_API_KEY` - The Cloudinary API key
* `CLOUDINARY_API_SECRET` - The Cloudinary API secret
* `CLOUDINARY_CLOUD_NAME` - The Cloudinary cloud name
