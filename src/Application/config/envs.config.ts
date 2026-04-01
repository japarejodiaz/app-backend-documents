export const EnvConfig = () => ({
  environment: process.env.NODE_ENV || 'develop',
  port: parseInt(process.env.PORT || '3001', 10),

  basePath: process.env.BASE_PATH || 'api',

  // variables de base de datos
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },

});