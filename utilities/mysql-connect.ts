import serverlessMysql from 'serverless-mysql';
import { DBConfig } from '../interfaces/db';

export const mysql = serverlessMysql();

export async function connect(config?: DBConfig) {
  if (isConfigVerified(config) || isEnvVerified()) {
    try {
      mysql.config({
        host: config?.dbHost || process.env.DB_HOST,
        user: config?.dbUser || process.env.DB_USER,
        password: config?.dbPass || process.env.DB_PASS,
        database: config?.dbName || process.env.DB_NAME,
      });

      if (config) {
        updateEnvConfig(config);
      }

      await mysql.connect();

      return true;
    } catch (e) {
      throw Error(`[mysql:connect]: ${e}`);
    }
  } else {
    return false;
  }
}

function updateEnvConfig(config: DBConfig) {
  if (config.dbHost) {
    process.env.DB_HOST = config.dbHost;
  }
  if (config.dbUser) {
    process.env.DB_USER = config.dbUser;
  }
  if (config.dbPass) {
    process.env.DB_PASS = config.dbPass;
  }
  if (config.dbName) {
    process.env.DB_NAME = config.dbName;
  }
}

function isConfigVerified(config?: DBConfig) {
  return config && (Object.keys(config) as (keyof DBConfig)[]).every((key) => config[key]);
}

function isEnvVerified() {
  return ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME'].every((key) => process.env[key]);
}
