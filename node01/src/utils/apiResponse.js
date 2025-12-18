const sendApiResponse = (
  res,
  statusCode,
  message,
  data = null,
  errors = null
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    message,
    data,
    errors,
    timestamp: new Date().toISOString()
  });
};

module.exports = sendApiResponse;
