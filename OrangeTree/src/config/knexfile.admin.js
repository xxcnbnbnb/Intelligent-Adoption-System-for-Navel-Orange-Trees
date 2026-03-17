require('dotenv').config();

const config = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.ADMIN_DB_HOST || 'localhost',
      port: process.env.ADMIN_DB_PORT || 3306,
      user: process.env.ADMIN_DB_USER || 'root',
      password: process.env.ADMIN_DB_PASSWORD || '',
      database: process.env.ADMIN_DB_NAME || 'orange_admin',
      charset: 'utf8mb4'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './database/migrations/admin'
    },
    seeds: {
      directory: './database/seeds/admin'
    }
  },

  test: {
    client: 'mysql2',
    connection: {
      host: process.env.ADMIN_DB_HOST || 'localhost',
      port: process.env.ADMIN_DB_PORT || 3306,
      user: process.env.ADMIN_DB_USER || 'root',
      password: process.env.ADMIN_DB_PASSWORD || '',
      database: process.env.ADMIN_DB_NAME_TEST || 'orange_admin_test',
      charset: 'utf8mb4'
    },
    pool: {
      min: 1,
      max: 5
    },
    migrations: {
      directory: './database/migrations/admin'
    },
    seeds: {
      directory: './database/seeds/admin'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.ADMIN_DB_HOST,
      port: process.env.ADMIN_DB_PORT,
      user: process.env.ADMIN_DB_USER,
      password: process.env.ADMIN_DB_PASSWORD,
      database: process.env.ADMIN_DB_NAME,
      charset: 'utf8mb4'
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      directory: './database/migrations/admin'
    }
  }
};

module.exports = config;