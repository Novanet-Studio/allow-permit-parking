declare namespace NodeJS {
  export type Environment = 'production' | 'development' | 'testing';

  export interface ProcessEnv {
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD?: string;
    APPLICATION_DOMAIN: string;
    COOKIE_SIGNATURE: string;
    DATABASE_URL?: string;
    JWT_TOKEN_COOKIE_NAME: string;
    JWT_REFRESH_TOKEN_COOKIE_NAME: string;
    JWT_EXPIRATION: string;
    JWT_REFRESH_TOKEN_EXPIRATION: string;
    JWT_PRIVATE_KEY: string;
    NODE_ENV: Environment;
    PORT: string;
    PGHOST: string;
    PGPORT: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
  }
}
