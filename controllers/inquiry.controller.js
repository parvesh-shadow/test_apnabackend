const InquiryModel = require("../model/Inquiry.model");
const axios = require("axios");
const zohoTokenModel = require("../model/zohoToken.model");

const refreshZohoAccessToken = async () => {
  try {
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    const clientID = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;

    // Keep check for credentials

    const url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientID}&client_secret=${clientSecret}&grant_type=refresh_token`;

    const res = await axios.post(url);
    // Save the token to the database
    await zohoTokenModel.updateOne(
      { key: "Zoho" },
      { $set: { accessToken: res?.data?.access_token } },
      { upsert: true }
    );

    // new accesstoken
    return {
      success: true,
      accessToken: res?.data?.access_token,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

const sendLeadToZoho = async (lead) => {
  try {
    // Read the accessToken from db
    const tokenData = await zohoTokenModel.findOne({ key: "Zoho" });
    let accessToken = tokenData?.accessToken || "";
    // Shape the data for Zoho CRM
    const shapedData = {
      data: [
        {
          Last_Name: lead.fullName || "Unknown",
          Email: lead.email,
          Phone: lead.mobile,
          Lead_Source: lead.source || "Website",
          Project_Id: lead.projectId || "",
        },
      ],
    };
    const response = await axios.post(
      "https://www.zohoapis.com/crm/v2/Leads",
      shapedData,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return {
      success: true,
      response: response.data,
    };
  } catch (error) {
    if (
      error.response?.data?.code === "AUTHENTICATION_FAILURE" ||
      error.response?.data?.code === "INVALID_TOKEN"
    ) {
      const tokenResponse = await refreshZohoAccessToken();
      if (tokenResponse?.success) {
        // Shape the data for Zoho CRM
        const shapedData = {
          data: [
            {
              Last_Name: lead.fullName || "Unknown",
              Email: lead.email,
              Phone: lead.mobile,
              Lead_Source: lead.source || "Website",
              Project_Id: lead.projectId || "",
            },
          ],
        };
        const response = await axios.post(
          "https://www.zohoapis.com/crm/v2/Leads",
          shapedData,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${tokenResponse?.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        return {
          success: true,
          message: "Lead created successfully",
          response: response.data,
        };
      } else {
        return {
          success: false,
          message: "Error during refreshing zoho access token",
        };
      }
    }
    return {
      success: false,
      message: "Error during sending lead to zoho",
      error,
    };
  }
};

exports.submitInquiryForm = async (req, res) => {
  try {
    const { fullName, mobile, email, source, projectId } = req.body;

    if (!fullName || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Save to database
    const newEntry = await InquiryModel.create({
      fullName,
      mobile,
      email,
      source,
      projectId,
    });
    // send lead to zoho
    await sendLeadToZoho(req.body);
    if (newEntry) {
      res.status(201).json({
        success: true,
        message: "Form submitted successfully.",
        newEntry,
      });
    }
  } catch (error) {
    // Handle duplicate or validation errors
    res.status(500).json({
      success: false,
      message: "Error submitting form.",
      error: error.message,
    });
  }
};

exports.getInquiry = async (req, res) => {
  try {
    const allInuiry = await InquiryModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Inquiry fetched successfully",
      inquiry: allInuiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting inquiry",
      error,
    });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Id is required",
      });
    }
    await InquiryModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in deleting inquiry",
      error,
    });
  }
};
