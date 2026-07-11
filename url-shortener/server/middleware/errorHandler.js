/**
 * Catches errors thrown/forwarded from controllers and returns a
 * consistent JSON error shape instead of leaking stack traces.
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'That short link already exists. Please try a different alias.',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Malformed ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format.' });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong on our end. Please try again.',
  });
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
};

export { errorHandler, notFound };
