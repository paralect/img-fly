module.exports = {
  aws: {
    accessKey: process.env.IMG_FLY_AWS_ACCESS_KEY,
    secretKey: process.env.IMG_FLY_AWS_SECRET_KEY,
    region: process.env.IMG_FLY_AWS_S3_REGION,
    bucket: process.env.IMG_FLY_AWS_S3_BUCKET,
  },
  storage: {
    type: 'mongo',
    connection: process.env.IMG_FLY_MONGO_CONNECTION,
    collection: process.env.IMG_FLY_MONGO_COLLECTION,
  },
  apiUrl: process.env.IMG_FLY_API_URL,
};
