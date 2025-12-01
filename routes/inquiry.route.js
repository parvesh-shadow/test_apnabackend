const express = require("express");
const {
  submitInquiryForm,
  getInquiry,
  deleteInquiry,
} = require("../controllers/inquiry.controller");
const verifyAdminToken = require("../middleware/protected");

const router = express.Router();

router.post("/addInquiry", submitInquiryForm);
router.get("/getInquiry", verifyAdminToken, getInquiry);
router.delete("/deleteInquiry/:id", verifyAdminToken, deleteInquiry);

module.exports = router;
