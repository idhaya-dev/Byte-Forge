import mongoose from 'mongoose';

const feedbackHistorySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the student ID'],
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the faculty ID'],
    },
    subjectName: {
      type: String,
      required: [true, 'Please provide the subject name'],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, 'Please provide the semester'],
      trim: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Please provide the academic year'],
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate feedback submissions
feedbackHistorySchema.index(
  { studentId: 1, facultyId: 1, subjectName: 1, semester: 1, academicYear: 1 },
  { unique: true }
);

const FeedbackHistory = mongoose.model('FeedbackHistory', feedbackHistorySchema);
export default FeedbackHistory;
