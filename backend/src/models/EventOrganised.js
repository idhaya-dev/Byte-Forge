import mongoose from 'mongoose';

const eventOrganisedSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event must belong to a faculty member'],
    },
    title: {
      type: String,
      required: [true, 'Please provide the event title'],
      trim: true,
    },
    eventType: {
      type: String,
      enum: ['Workshop', 'Conference', 'Seminar', 'Webinar', 'FDP'],
      default: 'Workshop',
      required: [true, 'Please select the event type'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide the start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide the end date'],
    },
    role: {
      type: String,
      enum: ['Coordinator', 'Convenor', 'Co-coordinator', 'Organizer'],
      required: [true, 'Please select your role in the event'],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const EventOrganised = mongoose.model('EventOrganised', eventOrganisedSchema);
export default EventOrganised;
