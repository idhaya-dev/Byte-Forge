import mongoose from 'mongoose';

const appraisalSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Appraisal must belong to a faculty member'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required (e.g., 2025-2026)'],
      trim: true,
    },
    selfAppraisal: {
      teachingHours: { type: Number, default: 0 },
      researchPapersCount: { type: Number, default: 0 },
      booksPublishedCount: { type: Number, default: 0 },
      studentProjectsGuided: { type: Number, default: 0 },
      selfRating: { type: Number, min: 1, max: 5 },
      achievements: { type: String },
      challengesText: { type: String },
      submitted: { type: Boolean, default: false },
      submittedAt: { type: Date },
    },
    hodEvaluation: {
      evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      teachingQualityRating: { type: Number, min: 1, max: 5 },
      researchContributionRating: { type: Number, min: 1, max: 5 },
      administrativeContributionRating: { type: Number, min: 1, max: 5 },
      generalConductRating: { type: Number, min: 1, max: 5 },
      comments: { type: String },
      submitted: { type: Boolean, default: false },
      submittedAt: { type: Date },
    },
    peerEvaluations: [
      {
        evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        collaborationRating: { type: Number, min: 1, max: 5 },
        professionalismRating: { type: Number, min: 1, max: 5 },
        comments: { type: String },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    studentFeedback: {
      averageTeachingRating: { type: Number, min: 1, max: 5, default: 0 },
      averageCourseCoverageRating: { type: Number, min: 1, max: 5, default: 0 },
      averageApproachabilityRating: { type: Number, min: 1, max: 5, default: 0 },
      totalResponses: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted By Faculty', 'Under Review By HOD', 'Completed'],
      default: 'Draft',
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a faculty gets only one appraisal document per academic year
appraisalSchema.index({ faculty: 1, academicYear: 1 }, { unique: true });

// Pre-save middleware to calculate the overall appraisal score if evaluations are submitted
appraisalSchema.pre('save', function (next) {
  if (this.selfAppraisal.submitted && this.hodEvaluation.submitted) {
    const self = this.selfAppraisal.selfRating || 3;
    
    // HOD Average (out of 5)
    const hod = (
      (this.hodEvaluation.teachingQualityRating || 3) +
      (this.hodEvaluation.researchContributionRating || 3) +
      (this.hodEvaluation.administrativeContributionRating || 3) +
      (this.hodEvaluation.generalConductRating || 3)
    ) / 4;

    // Peer Average (out of 5)
    let peer = 3;
    if (this.peerEvaluations.length > 0) {
      const sum = this.peerEvaluations.reduce((acc, curr) => {
        return acc + ((curr.collaborationRating || 3) + (curr.professionalismRating || 3)) / 2;
      }, 0);
      peer = sum / this.peerEvaluations.length;
    }

    // Student Average (out of 5)
    const student = (
      (this.studentFeedback.averageTeachingRating || 3) +
      (this.studentFeedback.averageCourseCoverageRating || 3) +
      (this.studentFeedback.averageApproachabilityRating || 3)
    ) / 3;

    // 360 Degree Weights: Self (15%), HOD (45%), Peer (20%), Student (20%)
    const finalScoreOutOfFive = (self * 0.15) + (hod * 0.45) + (peer * 0.20) + (student * 0.20);
    
    // Convert to percentage (out of 100)
    this.overallScore = Math.round((finalScoreOutOfFive / 5) * 100);
  }
  next();
});

const Appraisal = mongoose.model('Appraisal', appraisalSchema);
export default Appraisal;
