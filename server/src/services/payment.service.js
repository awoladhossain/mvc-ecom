import { stripe } from "../config/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

export const createCheckoutSessionService = async (payload, userId) => {
  const { products, couponCode } = payload;
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Products array is required and cannot be empty");
  }

  // line item
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

  // discount by coupon code

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
  if (totalAmount > 10000) {
    await createNewCoupon(userId);
  }
  const result = {
    id: session.id,
    totalAmount: totalAmount / 100,
  };
  return result;
};

export const checkoutSuccessService = async (params) => {
  const { sessionId } = params;

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    if (session.metadata.couponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: session.metadata.couponCode,
          userId: session.metadata.userId,
        },
        {
          isActive: false,
        },
      );
    }
    // crate a new order
    const products = JSON.parse(session.metadata.products);
    const newOrder = new Order({
      user: session.metadata.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: session.amount_total / 100,
      stripeSessionId: sessionId,
    });
    await newOrder.save();

    return newOrder._id;
  }
};

// create stripe coupon

async function createStripeCoupon(discountPercentage) {
  const stripeCoupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return stripeCoupon.id;
}

// create new coupon

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
    userId: userId,
  });
  await newCoupon.save();
  return newCoupon;
}
