const express = require("express");
const {
  check,
  createProject,
  getAll,
  getOneProject,
  updateDraft,
  publishProject,
  getDraft,
  getPublished,
  deleteProject,
} = require("../controllers/ProjectController");
const { upload } = require("../middleware/multer");
const verifyAdminToken = require("../middleware/protected");

const router = express.Router();
router.get("/check", check);
router.get("/allProject", getAll);
router.get("/getPublished", getPublished);

// Protected routes
router.use(verifyAdminToken);
router.post("/add", upload.any(), createProject);
router.get("/getOneProject/:id", getOneProject);
router.patch("/updateDraft/:id", upload.any(), updateDraft);
router.put("/publish/:id", publishProject);
router.get("/getDraft", getDraft);
router.delete("/deleteProject/:id", deleteProject);
module.exports = router;
