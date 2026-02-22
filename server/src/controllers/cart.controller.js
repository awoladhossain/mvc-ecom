import {
  addToCartService,
  getCartItemsService,
  removeAllFromCartService,
  updateQuantityService,
} from "../services/cart.service.js";

export const getCartItems = async (req, res) => {
  const result = await getCartItemsService(req.user);
  res.status(200).json({
    status: "success",
    data: result,
  });
};
export const addToCart = async (req, res) => {
  const result = await addToCartService(req.body, req.user);
  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    data: result,
  });
};

export const removeAllFromCart = async (req, res) => {
  const result = await removeAllFromCartService(req.body, req.user);
  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: result,
  });
};

export const quantityUpdate = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const result = await updateQuantityService(id, req.body, user);
  res.status(200).json({
    status: "success",
    message: "Quantity updated successfully",
    data: result,
  });
};
