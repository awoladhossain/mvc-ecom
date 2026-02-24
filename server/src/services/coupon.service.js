import Coupon from "../models/coupon.model.js";
import ApiError from "../utils/ApiError.js";

export const getCouponService = async (userId) => {
  const getCouponService = await Coupon.findOne({
    userId: userId,
    isActive: true,
  });

  if (!getCouponService) {
    throw new ApiError(404, "Coupon not found");
  }
  return getCouponService;
};

export const validateCouponService = async (code, userId) => {
  const coupon = await Coupon.findOne({ code, userId });

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  if (!coupon.isActive) {
    throw new ApiError(400, "This coupon has already been used or deactivated");
  }

  if (coupon.expirationDate < new Date()) {
    coupon.isActive = false;
    await coupon.save();
    throw new ApiError(400, "Coupon expired"); 
  }

  return {
    message: "Coupon is valid",
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
  };
};
