const mongoose = require("mongoose");

const project = new mongoose.Schema(
  {
    projectName: String,
    client: String,
    checkedBy: [],
    designedBy: [],
    location: String,
    status: String,
    submittedAt: Date,
    submittionPackage: [],
    updates: [
      {
        updateDate: {
          type: Date,
          default: Date.now,
        },
        update: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("project", project);
