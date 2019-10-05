const dotenv = require('dotenv')
dotenv.config()

const config = {
  HOST: process.env.SPONSORS_HOST || 'localhost',
  PORT: process.env.SPONSORS_PORT || 8888,
  SPONSORS_PATH: process.env.NODE_ENV === 'production'
    ? process.env.SPONSORS_PATH
    : 'localhost:8888',

  MONGO: {
    URL: process.env.SPONSORS_MONGO_URL || 'mongodb://localhost:27017',
    DB: process.env.SPONSORS_MONGO_DB || 'sponsors',
    TEST: process.env.SPONSORS_MONGO_DB_TEST || 'sponsors_test'
  },

  LOGENTRIES_TOKEN: process.env.SPONSORS_LOGENTRIES_TOKEN,

  STORAGE: {
    NAME: process.env.SPONSORS_STORAGE_NAME,
    KEY: process.env.SPONSORS_STORAGE_KEY,
    SECRET: process.env.SPONSORS_STORAGE_SECRET,
    REGION: process.env.SPONSORS_STORAGE_REGION,
    DOMAIN: process.env.SPONSORS_STORAGE_DOMAIN,
    PATH: process.env.NODE_ENV === 'production' ? '/sponsors/production/' : '/sponsors/dev/',
    TEST: '/sponsors/test/'
  },

  DECK: {
    HOST: process.env.NODE_ENV === 'production' ? 'https://deck.sinfo.org' : 'http://localhost',
    PORT: process.env.NODE_ENV === 'production' ? 443 : 8080
  },

  COORDINATION_EMAIL: 'coordination@sinfo.org',

  MAILGUN: {
    API_KEY: process.env.SPONSORS_MAILGUN_API_KEY,
    DOMAIN: 'sinfo.org'
  },

  CORS: process.env.NODE_ENV === 'production'
    ? ['*sinfo.org']
    : ['*']
}

const logger = process.env.SPONSORS_LOGENTRIES_TOKEN &&
  config.MAILGUN.API_KEY &&
  process.env.NODE_ENV === 'production'
  ? require('logger').getLogger(
    process.env.SPONSORS_LOGENTRIES_TOKEN,
    config.MAILGUN.API_KEY,
    'Sponsors'
  )
  : require('logger').getLogger()

module.exports = config

module.exports.validate = () => {
  if (process.env.NODE_ENV === 'production') {
    logger.warn('Running in production mode')

    if (config.SPONSORS_PATH === undefined) {
      logger.error('Env var of SPONSORS_PATH not defined')
      process.exit(1)
    }

    if (config.LOGENTRIES_TOKEN === undefined) {
      logger.warn('Production mode without logentries token given')
    }

    if (config.MAILGUN.API_KEY === undefined) {
      logger.error('Env var of SPONSORS_MAILGUN_API_KEY not defined')
      process.exit(1)
    }
  }

  for (let key of Object.keys(config.STORAGE)) {
    if (config.STORAGE[key] === undefined) {
      logger.error(`Env var of STORAGE.${key} not defined`)
      process.exit(1)
    }
  }
}
