console.log("--- MEDUSA CONFIG LOADING ---");
const { loadEnv, defineConfig } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      ssl: {
        rejectUnauthorized: false
      }
    },
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  plugins: [],
  modules: {},
})
