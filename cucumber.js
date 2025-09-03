module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/test/steps/**/*.ts', 'src/test/support/**/*.ts'],
    paths: ['src/test/features/'],
    format: ['progress', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true
  },
  android: {
    requireModule: ['ts-node/register'],
    require: [
      'src/test/support/world.ts',
      'src/test/support/allureHooks.ts', // Load our Allure screenshot hooks
      'src/test/support/**/*.ts',
      'src/test/steps/mobile/**/*.ts',
      'src/test/steps/common/**/*.ts'
    ],
    paths: [
      'src/test/features/**/demo.feature'
    ],
    tags: '@androiddemo',
    format: [
      'progress', 
      'json:reports/android-report.json',
      'json:allure-results/cucumber-report.json',
      'junit:allure-results/junit.xml'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true
  },
  ios: {
    requireModule: ['ts-node/register'],
    require: [
      'src/test/support/world.ts',
      'src/test/support/iosHooks.ts', // Load our specialized iOS hooks first
      'src/test/support/allureHooks.ts', // Load our Allure screenshot hooks
      'src/test/support/**/*.ts',
      'src/test/steps/mobile/**/*.ts',
      'src/test/steps/common/**/*.ts'
    ],
    paths: [
      'src/test/features/mobile/ios-demo.feature'
    ],
    tags: '@ios or @iosdemo',
    format: [
      'progress', 
      'json:reports/ios-report.json',
      'json:allure-results/cucumber-report.json',
      'junit:allure-results/junit.xml'
    ],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true
  },
  api: {
    requireModule: ['ts-node/register'],
    require: [
      'src/test/support/**/*.ts',
      'src/test/steps/api/apiCommonSteps.ts',
      'src/test/steps/api/apiAdvancedSteps.ts',
      'src/test/steps/api/apiValidationSteps.ts',
      'src/test/steps/api/advancedArraySteps.ts',
      'src/test/steps/common/commonSteps.ts'
    ],
    paths: [
      'src/test/features/api/simple-api.feature',
      'src/test/features/api/examples/**/*.feature',
      'src/test/features/api/advanced.feature'
    ],
    tags: '@api',
    format: ['progress', 'json:reports/api-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true
  }
}
