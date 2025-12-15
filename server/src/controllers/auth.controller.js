import { signupService } from "../services/auth.service.js";

export const signup = async (req, res) => {
  const user = await signupService(req.body);

  res.status(201).json({
    status: "success",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};
