const UA_ACCOUNT_STAGING ='UA-119700446-3'
const UA_ACCOUNT_PRODUCTION ='UA-119700446-4'
const IS_PRODUCTION = false

module.exports = {
  APP_NAME: 'ara-file-manager',
  VERSION: 'ga:appVersion',
  IS_PRODUCTION,
  ACTION: {
    OPEN: 'open',
    FIRST_OPEN: 'first-open',
    FINISH_TIME: 'finish-time'
  },
  LABEL: {
    AFS_CONTENT: 'afs-content'
  },
  CATEGORY: {
    APPLICATION: 'application',
    DOWNLOAD: 'download'
  },
  UA_ACCOUNT_CURRENT: IS_PRODUCTION ? UA_ACCOUNT_PRODUCTION : UA_ACCOUNT_STAGING
}
