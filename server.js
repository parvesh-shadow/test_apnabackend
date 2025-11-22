const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { connectDB } = require("./lib/db");

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/uploads", express.static("uploads"));

// Routes
const projectRoutes = require("./routes/project.route");
const authRoutes = require("./routes/auth.route");
const inquiryRoutes = require("./routes/inquiry.route");
const adminModel = require("./model/admin.model");

app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/inquiry", inquiryRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
  });
});

// Seed default admin
const seedDefaultAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "123456789";

    const existingAdmin = await adminModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("✓ Default admin already exists");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await adminModel.create({
      email: adminEmail,
      password: hashedPassword,
    });

    console.log("✓ Default admin created successfully");
    console.log(`  Email: ${adminEmail}`);
  } catch (error) {
    console.error("✗ Error seeding default admin:", error.message);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  await seedDefaultAdmin();

  app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT ${process.env.PORT}`);
  });
};

startServer();
