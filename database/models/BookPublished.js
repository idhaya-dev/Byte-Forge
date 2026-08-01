import mongoose from 'mongoose';

const bookPublishedSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Book must belong to a faculty member'],
    },
    title: {
      type: String,
      required: [true, 'Please provide the book title'],
      trim: true,
    },
    publisher: {
      type: String,
      required: [true, 'Please provide the publisher name'],
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: [true, 'Please provide the publication year'],
      min: [1900, 'Invalid publication year'],
      max: [new Date().getFullYear() + 1, 'Invalid publication year'],
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

const BookPublished = mongoose.model('BookPublished', bookPublishedSchema);
export default BookPublished;
