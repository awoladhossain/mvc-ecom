import { stripe } from "../config/stripe.js";
import Coupon from "../models/coupon.model.js";

export const createCheckoutSessionService = async (payload, userId) => {
  const { products, couponCode } = payload;
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Products array is required and cannot be empty");
  }

  // line item

  const lineItems = products.map((product) => {
    const amount = Math.round(product.price * 100);
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

  // discount by coupon code

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode,
      userId: userId,
      isActive: true,
    });
  }

  // strip payment session

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    discounts: coupon
      ? [
          {
            coupon: await createStripeCoupon(coupon.discountPercentage),
          },
        ]
      : [],
    metadata: {
      userId: userId,
      couponCode: couponCode || null,
      products: JSON.stringify(
        products.map((p) => ({
          id: p._id,
          quantity: p.quantity,
          price: p.price,
        })),
      ),
    },
  });
  return session;
};

// create stripe coupon

async function createStripeCoupon(discountPercentage) {
  const stripeCoupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return stripeCoupon.id;
}
