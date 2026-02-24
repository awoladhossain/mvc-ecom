import {
  getCouponService,
  validateCouponService,
} from "../services/coupon.service.js";

export const getCoupon = async (req, res) => {
  const userId = req.user.userId;
  const result = await getCouponService(userId);

  res.status(200).json({
    status: "success",
    data: result,
  });
};

export const validateCoupon = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.userId;
  const result = await validateCouponService(code, userId);
  res.status(200).json({
    status: "success",
    data: result,
  });
};
