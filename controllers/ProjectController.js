const ProjectModel = require("../model/Project.model");
const { customAlphabet } = require("nanoid");
const generatePageId = customAlphabet("0123456789", 4);

function setNestedValue(obj, path, value) {
  const keys = path.replace(/\]/g, "").split(/\[/);
  let current = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) {
        current[key] = isNaN(keys[index + 1]) ? {} : [];
      }
      current = current[key];
    }
  });
}

exports.createProject = async (req, res) => {
  try {
    let data = req.body;
    data.pageId = generatePageId();
    const project = await ProjectModel.create(data);
    res.json({
      success: true,
      message: "Project created successfully",
      data,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in creating project",
      error,
    });
  }
};

exports.getOneProject = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Single project fetched successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting single projects",
      error,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const allProjects = await ProjectModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All projects fetched successfully",
      allProjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting all projects",
      error,
    });
  }
};

exports.updateDraft = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    // If JSON inside req.body is stringified → parse it
    Object.keys(data).forEach((key) => {
      try {
        data[key] = JSON.parse(data[key]);
      } catch (err) {}
    });

    // Inject file paths into the right place
    req.files.forEach((file) => {
      const fieldPath = file.fieldname;
      const filePath = file.path;

      setNestedValue(data, fieldPath, filePath);
    });

    const updated = await ProjectModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json({
      message: "Draft saved successfully",
      updated: updated,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in update draft",
      error,
      success: false,
    });
  }
};

exports.publishProject = async (req, res) => {
  try {
    const id = req.params.id;

    const updated = await ProjectModel.findByIdAndUpdate(
      id,
      { status: "publish" },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "Project published successfully",
      updated: updated,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in publish project",
      error,
      success: false,
    });
  }
};

exports.getPublished = async (req, res) => {
  try {
    const publishedProject = await ProjectModel.find({
      status: "publish",
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Published project fetched",
      publishedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting published project",
      error,
    });
  }
};

exports.getDraft = async (req, res) => {
  try {
    const draftProject = await ProjectModel.find({ status: "draft" }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      message: "Draft project fetched",
      draftProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in getting published project",
      error,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await ProjectModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: " project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in deleting project",
      error,
    });
  }
};

exports.check = (req, res) => {
  res.send({
    success: true,
    message: "Running from route",
  });
};
