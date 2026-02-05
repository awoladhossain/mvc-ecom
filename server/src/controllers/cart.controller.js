import { addToCartService } from "../services/cart.service.js"

export const addToCart = async(req, res) => {
  const result = await addToCartService();

}
