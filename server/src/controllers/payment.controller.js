import {
  checkoutSuccessService,
  createCheckoutSessionService,
} from "../services/payment.service.js";

export const createCheckoutSessionController = async (req, res) => {
  const session = await createCheckoutSessionService(req.body, req.user.userId);
  res.status(200).json({
    status: "success",
    message: "Checkout session created successfully",
    data: session,
  });
};

export const checkoutSuccessController = async (req, res) => {
  const orderId = await checkoutSuccessService(req.body);
  res.status(200).json({
    status: "success",
    message: "Checkout success",
    data: {
      orderId,
    },
  });
};
