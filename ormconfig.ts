const {
  PGHOST = '127.0.0.1',
  PGPORT = 5432,
  POSTGRES_DB = 'parking',
  POSTGRES_USER = 'parking',
  POSTGRES_PASSWORD = 'parking',
  NODE_ENV = 'development',
  DATABASE_URL,
} = process.env;

const getConfig = (ssl = false) => {
  const basic = {
    type: 'postgres',
    host: PGHOST,
    port: PGPORT,
    url: DATABASE_URL,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    entities: ['./src/server/models/*.ts'],
    migrations: ['./migration/*.ts'],
    cli: {
      migrationsDir: 'migration',
      entitiesDir: 'src/server/models',
    },
  }

  if (ssl) {
    return {
      ...basic,
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}

const config = getConfig(NODE_ENV === 'production');


export default { ...config };
