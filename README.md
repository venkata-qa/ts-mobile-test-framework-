# TypeScript Mobile Testing Framework

A modern, comprehensive mobile and API testing framework built with TypeScript, WebdriverIO, Cucumber, and other best-in-class technologies.

## Features

- **Cross-Platform Mobile Testing**: Test both Android and iOS apps with the same codebase
- **iOS Testing**: Specialized iOS testing with direct simulator connection (see [iOS Testing Guide](./docs/iOS-TESTING.md))
- **API Testing**: Built-in support for API testing with a [simplified approach](./API-TESTING.md)
- **Page Object Model**: Well-structured page object pattern
- **BDD Approach**: Cucumber integration for behavior-driven development
- **TypeScript**: Type safety and modern JavaScript features
- **Dependency Injection**: Clean architecture with TSyringe
- **Reporting**: Allure reporting integration
- **Cloud Integration**: Support for BrowserStack, SauceLabs and other cloud providers
- **CI/CD Ready**: Designed for integration with CI/CD pipelines
- **Parallel Execution**: Run tests in parallel for faster feedback

## Project Structure

```
ts-mobile-test-framework/
├── config/                  # Configuration files
│   ├── default.json         # Default configuration
│   ├── dev.json             # Dev environment configuration
│   └── qa.json              # QA environment configuration
├── src/
│   ├── api/                 # API testing related code
│   │   ├── apiClient.ts     # HTTP client
│   │   ├── models/          # API models and interfaces
│   │   └── helpers/         # API testing helpers
│   ├── config/              # Configuration code
│   │   ├── capabilities/    # Mobile capabilities
│   │   └── env.config.ts    # Environment configuration
│   ├── core/                # Core framework code
│   │   ├── driver/          # Driver management
│   │   ├── reporting/       # Reporting utilities
│   │   └── utils/           # Utilities and helpers
│   ├── db/                  # Database testing related code
│   │   └── dbClient.ts      # Database client
│   ├── ui/                  # UI testing related code
│   │   ├── pageObjects/     # Page Object Models
│   │   └── componentObjects/ # Reusable component objects
│   └── test/                # Test code
│       ├── features/        # Cucumber feature files
│       │   ├── api/         # API features
│       │   ├── mobile/      # Mobile features
│       │   ├── ui/          # UI features
│       │   ├── db/          # Database features
│       │   └── integration/ # Integration/E2E features
│       ├── steps/           # Step definitions
│       │   ├── common/      # Common step definitions
│       │   │   ├── apiSteps.ts    # Common API steps
│       │   │   ├── commonSteps.ts # Generic shared steps
│       │   │   ├── dbSteps.ts     # Common DB steps
│       │   │   ├── mobileSteps.ts # Common Mobile steps
│       │   │   └── uiSteps.ts     # Common UI steps
│       │   ├── mobile/      # Mobile-specific step definitions
│       │   └── api/         # API-specific step definitions
│       └── support/         # Test support code
│           ├── hooks.ts     # Cucumber hooks
│           └── world.ts     # Cucumber world
└── package.json             # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)
- For mobile testing:
  - Appium Server (v2.0 or higher)
  - Android SDK (for Android testing)
  - Xcode (for iOS testing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ts-mobile-test-framework.git
   cd ts-mobile-test-framework
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running Tests

Run all tests:
```bash
npm test
```

Run Android tests:
```bash
npm run test:android
```

Run iOS tests:
```bash
npm run test:ios
```

Run iOS tests with Allure reporting:
```bash
./scripts/run-ios-tests-with-allure.sh
```

Run API tests:
```bash
npm run test:api
```

Run tests in parallel:
```bash
npm run test:parallel
```

### Allure Reporting

This framework includes Allure reporting for better visualization and analysis of test results.

Generate and open Allure reports:
```bash
npm run report
```

Features of our Allure reporting:
- Screenshot capture on test failures
- Device information and capabilities
- Test execution timeline
- Categorized failures for easier debugging
- Environment information

### Viewing Reports

Generate and open Allure reports:
```bash
npm run report
```

## Adding New Tests

### Adding a new page object:

1. Create a new file in `src/ui/pageObjects/`
2. Extend the `BasePage` class
3. Implement necessary elements and methods

Example:
```typescript
import { injectable } from 'tsyringe';
import { BasePage } from './basePage';

@injectable()
export class HomePage extends BasePage {
  get pageIdentifier(): string {
    return 'Home Screen';
  }
  
  // Add elements and methods
}
```

### Adding a new feature file:

1. Create a new `.feature` file in `src/test/features/mobile/` or `src/test/features/api/`
2. Write scenarios using Gherkin syntax
3. Tag scenarios appropriately (e.g., `@android`, `@ios`, `@api`)

### Adding new step definitions:

1. Create a new file in `src/test/steps/mobile/` or `src/test/steps/api/`
2. Import the `TestWorld` and necessary page objects
3. Implement steps using Given/When/Then functions

## Common Steps Approach

One of the key features of this framework is the unified approach to step definitions. The framework provides common, reusable steps across different testing types:

### Common Step Types

1. **Common Generic Steps**: General steps that can be used in any test type
   - Basic waiting, validations, and assertions
   - Screenshot capture and reporting

2. **UI Common Steps**: Steps for interacting with UI elements
   - Clicking, typing, validating elements
   - Works for both web and mobile testing

3. **Mobile Common Steps**: Mobile-specific steps
   - App lifecycle management (launch, close, background)
   - Gesture control (swipe, tap, long press)
   - Device-specific actions (orientation, alerts)

4. **API Common Steps**: REST API testing steps
   - Request building and sending
   - Response validation
   - Authentication and headers

5. **DB Common Steps**: Database testing steps
   - Connection management
   - Query execution and validation
   - Transaction control

### Benefits of Common Steps

- **Reduced Duplication**: Common steps eliminate code duplication
- **Unified Approach**: Same step definitions work across different testing types
- **Integration Testing**: Easy to combine API, UI, Mobile, and DB steps in one scenario
- **Maintainability**: Change a step once, affects all usages
- **Readability**: Consistent language across all feature files

## Best Practices

1. **Keep Page Objects Focused**: Each page object should represent a single screen or component
2. **Use Proper Tagging**: Tag scenarios with `@android`, `@ios`, `@api`, or `@db` for proper hooks
3. **Handle Waits Properly**: Use explicit waits instead of implicit waits when possible
4. **Maintain Element Selectors**: Keep selectors updated as the app changes
5. **Use Dependency Injection**: Leverage TSyringe for clean architecture
6. **Use Common Steps**: Prefer common steps when available instead of creating duplicates
7. **Integration Testing**: Combine different testing types in a single scenario when appropriate
8. **Write Clear Documentation**: Document page objects, steps, and utilities

## Configuration

The framework uses a layered configuration approach:

1. Default values in code
2. Configuration files (`config/*.json`)
3. Environment variables
4. Runtime parameters

Priority increases from top to bottom, so environment variables override configuration files.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
