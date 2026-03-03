import Coupon from "../models/coupon.model.js";

export const createCheckoutSessionService = async (payload, userId) => {
  const { products, couponCode } = payload;
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Products array is required and cannot be empty");
  }
  let totalAmount = 0;

  const lineItems = products.map((product) => {
    const amount = Math.round(product.price * 100);
    totalAmount += amount * product.quantity;
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: amount,
      },
      quantity: product.quantity || 1,
    };
  });

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode,
      userId: userId,
      isActive: true,
    });
    if (coupon) {
      totalAmount -= Math.round(
        (totalAmount * coupon.discountPercentage) / 100,
      );
    }
    
  }
};
