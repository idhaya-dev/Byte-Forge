import mongoose from 'mongoose';

const researchPaperSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Research paper must belong to a faculty member'],
    },
    title: {
      type: String,
      required: [true, 'Please provide the research paper title'],
      trim: true,
    },
    journal: {
      type: String,
      required: [true, 'Please provide the journal name'],
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: [true, 'Please provide the publication year'],
      min: [1900, 'Invalid publication year'],
      max: [new Date().getFullYear() + 1, 'Invalid publication year'],
    },
    doi: {
      type: String,
      trim: true,
    },
    citationCount: {
      type: Number,
      default: 0,
      min: [0, 'Citations cannot be negative'],
    },
    url: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ResearchPaper = mongoose.model('ResearchPaper', researchPaperSchema);
export default ResearchPaper;
