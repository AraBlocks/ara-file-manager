const UA_ACCOUNT_STAGING ='UA-119700446-3'
const UA_ACCOUNT_PRODUCTION ='UA-119700446-4'
const IS_PRODUCTION = !Boolean(process.env.IS_PROD)

module.exports = {
  APP_NAME: 'ara-file-manager',
  VERSION: 'ga:appVersion',
  IS_PRODUCTION,
  ACTION: {
    OPEN: 'open',
    COMPLETE: 'complete',
    FIRST_OPEN: 'first-open',
    FINISH_TIME: 'finish-time',
    START_TIME: 'start-time'
  },
  LABEL: {
    AFS_CONTENT: 'afs-content'
  },
  CATEGORY: {
    APPLICATION: 'application',
    DOWNLOAD: 'download',
    PUBLISH: 'publish',
    PURCHASE: 'purchase'
  },
  UA_ACCOUNT_CURRENT: IS_PRODUCTION ? UA_ACCOUNT_PRODUCTION : UA_ACCOUNT_STAGING
}
