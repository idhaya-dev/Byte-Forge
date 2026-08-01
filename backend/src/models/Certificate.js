import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Certificate must belong to a faculty member'],
    },
    title: {
      type: String,
      required: [true, 'Please provide the certificate title'],
      trim: true,
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Please provide the issuing organization'],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, 'Please provide the issue date'],
    },
    expirationDate: {
      type: Date,
    },
    credentialId: {
      type: String,
      trim: true,
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
