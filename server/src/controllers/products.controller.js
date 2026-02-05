import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getFeaturedProductsService,
  getRecommendedProductsService,
} from "../services/products.service.js";

export const getAllProducts = async (req, res) => {
  const result = await getAllProductsService();

  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const getFeaturedProducts = async (req, res) => {
  const result = await getFeaturedProductsService();

  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const createProduct = async (req, res) => {
  const result = await createProductService(req.body);
  res.status(200).json({
    status: "success",
    message: "Product created successfully",
    data: result,
  });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const result = await deleteProductService(id);
  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: result,
  });
};

export const getRecommendedProducts = async (req, res) => {
  const result = await getRecommendedProductsService();
  res.status(200).json({
    status: "success",
    message: "Recommended products fetched successfully",
    data: result,
  });
};
