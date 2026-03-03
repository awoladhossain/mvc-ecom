import { createCheckoutSessionService } from "../services/payment.service.js";

export const createCheckoutSessionController = async (req, res) => {
  const result = await createCheckoutSessionService(req.body);
  res.status(200).json({
    status: "success",
    message: "Checkout session created successfully",
    data: result,
  });
};
