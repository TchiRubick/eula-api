const config = {
  database: {
    url: process.env.DB_URL || 'mongodb://root:example@mongodb:27017/',
    options: {},
  },
};

export default config;
