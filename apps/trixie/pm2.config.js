module.exports = {
  apps: [
    {
      name: 'trixie',
      script: './dist/apps/trixie/src/main.js',
      watch: true,
      env_development: {
        PORT: 5000,
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: 5000,
        NODE_ENV: 'production',
      },
    },
  ],
};
