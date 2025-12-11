import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Add a title for the donation'],
      trim: true,
      maxlength: [100, 'Title can not be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    foodType: {
      type: String,
      required: [true, 'Please specify the food type'],
      enum: [
        'Cooked Meal',
        'Vegetables',
        'Fruits',
        'Canned Goods',
        'Baked Goods',
        'Dairy',
        'Beverages',
        'Grains',
        'Other',
      ],
    },
    quantity: {
      type: String,
      required: [true, 'Please specify the quantity (e.g., 5kg, 10 boxes)'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Add a pickup address'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
        default: [0, 0],
      },
      formattedAddress: String,
    },
    bestBefore: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Available', 'Pending', 'Confirmed', 'In Transit', 'Delivered', 'Expired'],
      default: 'Available',
    },
    images: {
      type: [String],
      default: [],
    },
    allergens: {
      type: [String],
      default: [],
    },
    dietaryInfo: {
      type: [String],
      default: [],
    },
    donor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Donation', donationSchema);