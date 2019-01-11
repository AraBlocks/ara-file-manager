const UA_ACCOUNT_STAGING ='UA-119700446-3'
const UA_ACCOUNT_PRODUCTION ='UA-119700446-4'
const IS_PRODUCTION = false

module.exports = {
  APP_NAME: 'ara-file-manager',
  VERSION: 'ga:appVersion',
  IS_PRODUCTION,
  ACTION: {
    OPEN: 'open',
    FIRST_OPEN: 'first-open'
  },
  CATEGORY: {
    APPLICATION: 'application'
  },
  UA_ACCOUNT_CURRENT: IS_PRODUCTION ? UA_ACCOUNT_PRODUCTION : UA_ACCOUNT_STAGING
}
