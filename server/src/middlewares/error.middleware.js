// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err?.statusCode || err?.status || 500;

  res.status(statusCode).json({
    status: "error",
    message: err?.message || "Something went wrong",
  });
};
