const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
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
const ProjectModel = require("./model/Project.model");

app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/inquiry", inquiryRoutes);

// // Serve static files from frontend build
// const frontendDistPath = path.join(__dirname, "../frontend/dist");
// app.use(express.static(frontendDistPath));

// // Import SEO template and Project model
// const seoTemplate = require("./views/seoTemplate");
// const Project = require("./model/Project.model");

// // SSR Route Handler - Must be after API routes and static files
// // Using regex pattern instead of * for Express 5.x compatibility
// app.get(/^\/(?!api\/|uploads\/|assets\/).*/, async (req, res) => {
//   try {
//     const slug = req.path.slice(1); // Remove leading slash

//     // Default SEO values
//     let seoData = {
//       title: "Apna Project",
//       description: "Welcome to Apna Project",
//       scripts: [],
//     };

//     // If slug exists, fetch SEO data from database
//     if (slug && slug !== "") {
//       const project = await Project.findOne({ "SEO.slug": slug, status: "published" });

//       if (project && project.SEO) {
//         seoData = {
//           title: project.SEO.title || seoData.title,
//           description: project.SEO.metaDescription || seoData.description,
//           scripts: project.SEO.scripts || [],
//         };
//       }
//     }

//     // Read the built index.html to extract asset files
//     const indexPath = path.join(frontendDistPath, "index.html");
//     const indexHtml = fs.readFileSync(indexPath, "utf-8");

//     // Extract CSS and JS files from the built index.html
//     const cssMatches = indexHtml.match(/href="(\/assets\/[^"]+\.css)"/g) || [];
//     const jsMatches = indexHtml.match(/src="(\/assets\/[^"]+\.js)"/g) || [];

//     const cssFiles = cssMatches.map(match => match.match(/href="([^"]+)"/)[1]);
//     const jsFiles = jsMatches.map(match => match.match(/src="([^"]+)"/)[1]);

//     // Generate HTML with SEO data
//     const html = seoTemplate({
//       title: seoData.title,
//       description: seoData.description,
//       scripts: seoData.scripts,
//       appHtml: "", // Empty for now, React will hydrate on client side
//       cssFiles,
//       jsFiles,
//     });

//     res.send(html);
//   } catch (error) {
//     console.error("SSR Error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

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

app.get("/seo/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  // Fetch SEO data from DB
  const page = await ProjectModel.findOne({ "SEO.slug": slug });
  console.log(page);
  if (!page) {
    return res.status(404).send("Page Not Found by backend");
  }

  const {
    title,
    metaDescription,
    canonical,
    robots,
    ogTitle,
    ogDescription,
    scripts,
  } = page.SEO;

  // Build dynamic HTML (SSR for head tags)
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <script type="module">import { injectIntoGlobalHook } from "/@react-refresh";
injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;</script>
<script type="module" src="/@vite/client"></script>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" sizes="48x48" href="http://localhost:5173/src/assets/logo.png">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <meta name="description" content="${metaDescription}" />
      
      <meta property="og:title" content="${ogTitle}" />
      <meta property="og:description" content="${ogDescription}" />
      
      <link rel="canonical" href="${canonical}" />
      <style type="text/css" data-vite-dev-id="C:/Users/VINOD/Documents/DI_Work/Apna_Landing/src/index.css"></style>
  </head>

  <body>
      <div id="root"></div>

      <!-- load react app -->
      <script type="module" src="/src/main.jsx"></script>
  </body>
  </html>
  `;

  res.send(html);
});

// Start server
const startServer = async () => {
  await connectDB();
  await seedDefaultAdmin();

  app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT ${process.env.PORT}`);
  });
};

startServer();
