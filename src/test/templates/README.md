# Testing Templates

## Usage

Copy the appropriate template and rename it for your component:

### Component Template
- **File**: `ComponentTemplate.test.jsx`
- **Use for**: UI components with props and interactions
- **Features**: Props testing, user events, mocking

### Page Template  
- **File**: `PageTemplate.test.jsx`
- **Use for**: Page components with routing and localStorage
- **Features**: Router wrapper, localStorage mocking, navigation testing

### Hook Template
- **File**: `HookTemplate.test.jsx` 
- **Use for**: Custom React hooks
- **Features**: Hook rendering, state updates, side effects

### Util Template
- **File**: `UtilTemplate.test.jsx`
- **Use for**: Pure utility functions
- **Features**: Input/output testing, edge cases, error handling

## Quick Start

1. Copy template: `cp ComponentTemplate.test.jsx MyComponent.test.jsx`
2. Replace `ComponentName` with your component name
3. Update import path and props
4. Customize test cases for your component's functionality