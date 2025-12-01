const mongoose = require("mongoose");

const ZohoTokenSchema = new mongoose.Schema({
  accessToken: {
    type: String,
  },
  key:{
    type:String,
  }
});

module.exports = mongoose.model("ZohoToken", ZohoTokenSchema);
