import redis from "../config/redis.js";
import Product from "../models/product.model.js";


export const getAllProductsService = async () => {
  const products = await Product.find({});
  return products;
};

export const getFeaturedProductsService = async () => {
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
  const product = await Product.create(data);
  return product;
};
