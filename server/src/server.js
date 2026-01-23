import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
dotenv.config(); // ← Move this to the TOP before other imports

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed", error);
    process.exit(1);
  }
})();
