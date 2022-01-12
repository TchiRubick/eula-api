const config = {
  database: {
    url: process.env.DB_URL || 'mongodb://root:example@eula-db:27017/',
    options: {},
  },
};

export default config;
