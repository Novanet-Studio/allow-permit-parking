export default function checkenv(): void {
  const REQUIRED_ENVIRONMENT_VARIABLES = [
    'APPLICATION_DOMAIN',
    'COOKIE_SIGNATURE',
    'JWT_TOKEN_COOKIE_NAME',
    'JWT_REFRESH_TOKEN_COOKIE_NAME',
    'JWT_EXPIRATION',
    'JWT_REFRESH_TOKEN_EXPIRATION',
    'JWT_PRIVATE_KEY',
    'NODE_ENV',
    'PORT',
  ];

  for (const env of REQUIRED_ENVIRONMENT_VARIABLES) {
    if (typeof process.env[env] === 'undefined') {
      throw new Error(`Missing "${env}" environment variable`);
    }
  }
}
