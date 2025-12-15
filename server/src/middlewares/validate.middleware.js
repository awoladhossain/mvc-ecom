import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: err.issues.map((e) => e.message).join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Validation error",
    });
  }
};
