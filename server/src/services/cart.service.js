// import Product from "../models/product.model.js";

export const getCartItemsService = async (user) => {
  // const products = await Product.find({ _id: { $in: payload.cartItems } });

  // const cartItems = products.map((product) => {
  //   const item = payload.cartItems.find(
  //     (cartItem) => cartItem.id === product.id,
  //   );
  //   return { ...product.toJSON(), quantity: item.quantity };
  // });
  await user.populate("cartItems.product");
  return user.cartItems;

  // return cartItems;
};

export const addToCartService = async (payload, user) => {
  const { productId } = payload;

  // const existingItem = user.cartItems.find((item) => item.id === productId);
  const existingItem = user.cartItems.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // অবজেক্ট আকারে পুশ করুন
    user.cartItems.push({ product: productId, quantity: 1 });
  }
  await user.save();
  return user.cartItems;
};

export const removeAllFromCartService = async (payload, user) => {
  const { productId } = payload;
  if (!productId) {
    user.cartItems = [];
  } else {
    user.cartItems = user.cartItems.filter(
      (item) => item.product.toString() !== productId,
    );
  }
  await user.save();
  return user.cartItems;
};

export const updateQuantityService = async (id, payload, user) => {
  const { quantity } = payload;

  const existingItem = user.cartItems.find(
    (item) => item.product.toString() === id,
  );

  if (existingItem) {
    if (quantity <= 0) {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== id,
      );
    } else {
      existingItem.quantity = quantity;
    }
    await user.save();
    return user.cartItems;
  } else {
    throw new Error("Product not found in cart");
  }
};
