import mongoose from 'mongoose';

/**
 * A single visit event, kept so we can build simple time-series analytics
 * (clicks over time) without needing a separate collection.
 */
const visitSchema = new mongoose.Schema(
  {
    visitedAt: { type: Date, default: Date.now },
    referrer: { type: String, default: 'direct' },
  },
  { _id: false }
);

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    customAlias: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    lastVisited: {
      type: Date,
      default: null,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    // Optional bcrypt hash — when set, the redirect route requires a password.
    password: {
      type: String,
      default: null,
    },
    // Optional expiry date. After this date the link stops redirecting.
    expiresAt: {
      type: Date,
      default: null,
    },
    visits: {
      type: [visitSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Speeds up "most clicked" / "newest" sorts used by the dashboard.
urlSchema.index({ createdAt: -1 });
urlSchema.index({ clicks: -1 });

const Url = mongoose.model('Url', urlSchema);

export default Url;
