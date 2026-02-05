import cloudinary from "../config/cloudinary.js";
import { getRedis } from "../config/redis.js";
import Product from "../models/product.model.js";

export const getAllProductsService = async () => {
  const products = await Product.find({});
  return products;
};

export const getFeaturedProductsService = async () => {
  const redis = getRedis();
  let featuredProducts = await redis.get("featured_products");
  if (featuredProducts) {
    return JSON.parse(featuredProducts);
  }

  // if not in redis, fetch from db;
  featuredProducts = await Product.find({ isFeatured: true }).lean();
  if (!featuredProducts) {
    return [];
  }
  // store in redis
  await redis.set("featured_products", JSON.stringify(featuredProducts), {
    ex: 60 * 5,
  });
  return featuredProducts;
};

export const createProductService = async (data) => {
  const { name, description, price, image, category } = data;
  let cloudinaryResponse = null;
  if (image) {
    cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: "products",
    });
  }
  const product = await Product.create({
    name,
    description,
    price,
    image: cloudinaryResponse?.secure_url,
    category,
  });
  return product;
};

export const deleteProductService = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  if (product.image) {
    const publicId = product.image.split("/").pop().split(".")[0];
    try {
      await cloudinary.uploader.destroy(`products/${publicId}`);
      console.log("image deleted from cloudinary ");
    } catch (error) {
      console.log("error while deleting image from cloudinary", error);
    }
  }
  await Product.findByIdAndDelete(id);
  return true;
};
