const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
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
    picture: String, // Add this line for the picture
    createdBy: { type: mongoose.ObjectId, ref: 'user', }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('project', projectSchema);
