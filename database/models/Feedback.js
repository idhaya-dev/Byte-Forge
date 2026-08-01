import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the faculty ID'],
    },
    academicYear: {
      type: String,
      required: [true, 'Please provide the academic year'],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, 'Please provide the semester'],
      trim: true,
    },
    subjectName: {
      type: String,
      required: [true, 'Please provide the subject name'],
      trim: true,
    },
    ratings: {
      teachingEffectiveness: {
        type: Number,
        required: [true, 'Please rate teaching effectiveness'],
        min: 1,
        max: 5,
      },
      courseCoverage: {
        type: Number,
        required: [true, 'Please rate course coverage'],
        min: 1,
        max: 5,
      },
      communicationSkills: {
        type: Number,
        required: [true, 'Please rate communication skills'],
        min: 1,
        max: 5,
      },
      punctuality: {
        type: Number,
        required: [true, 'Please rate punctuality'],
        min: 1,
        max: 5,
      },
      supportOutsideClass: {
        type: Number,
        required: [true, 'Please rate support outside class'],
        min: 1,
        max: 5,
      },
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comments cannot exceed 1000 characters'],
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

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
