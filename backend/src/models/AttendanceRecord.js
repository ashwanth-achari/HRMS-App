// src/models/AttendanceRecord.js
const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "ON_LEAVE", "HOLIDAY", "WEEKOFF"],
      required: true,
      default: "PRESENT",
    },
    // Keeping these as simple strings like "09:01" to match your UI text
    checkInTime: {
      type: String,
      default: null,
    },
    checkOutTime: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "attendance_records",
  }
);

// One attendance record per user per day
attendanceRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);

module.exports = AttendanceRecord;
