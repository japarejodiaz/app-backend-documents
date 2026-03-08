export const EnvConfig = () => ({
  environment: process.env.NODE_ENV || 'develop',
  port: parseInt(process.env.PORT || '3001', 10),

  // variables de base de datos
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
});