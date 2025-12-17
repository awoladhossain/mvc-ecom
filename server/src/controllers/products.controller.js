import { getAllProductsService } from "../services/products.service.js";

export const getAllProducts = async (req, res) => {
  const result = await getAllProductsService();

  res.status(200).json({
    status: "success",
    data: result,
  });
};
