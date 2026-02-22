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

// export const createProductService = async (data) => {
//   const { name, description, price, image, category } = data;
//   let cloudinaryResponse = null;
//   if (image) {
//     cloudinaryResponse = await cloudinary.uploader.upload(image, {
//       folder: "products",
//       // resource_type: "auto",
//     });
//   }
//   const product = await Product.create({
//     name,
//     description,
//     price,
//     image: cloudinaryResponse?.secure_url || "",
//     category,
//   });
//   return product;
// };

export const createProductService = async (data, file) => {
  const { name, description, price, category } = data;
  let imageUrl = "";

  if (file) {
    // ফাইলটিকে Base64 এ রূপান্তর করে ক্লাউডিনারিতে পাঠানো
    const base64Image = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64Image}`;

    const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
      folder: "products",
    });
    imageUrl = cloudinaryResponse.secure_url;
  }

  const product = await Product.create({
    name,
    description,
    price,
    image: imageUrl,
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
    const filename = product.image.split("/").pop();
    const publicId = filename.substring(0, filename.lastIndexOf("."));
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

export const getRecommendedProductsService = async () => {
  const products = await Product.aggregate([
    {
      $sample: { size: 3 },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        price: 1,
      },
    },
  ]);
  return products;
};

export const getProductsByCategoryService = async (category) => {
  const products = await Product.find({ category });
  return products;
};

export const toggleFeaturedProductService = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  product.isFeatured = !product.isFeatured;
  const updatedProduct = await product.save();
  await updateFeaturedProductsCache();
  return updatedProduct;
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    const redis = getRedis();
    redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.error("Error updating featured products cache:", error);
  }
}
