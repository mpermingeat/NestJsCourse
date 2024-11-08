export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  moongoDb: process.env.MONGODB,
  port: process.env.PORT || 3000,
});
