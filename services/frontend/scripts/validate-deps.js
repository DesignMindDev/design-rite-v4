const fs = require('fs');
const path = require('path');

console.log('?? Validating dependencies for production...');

const packageJson = require('../package.json');
const lockFile = require('../package-lock.json');

// Check for exact versions
Object.entries(packageJson.dependencies).forEach(([pkg, version]) => {
  if (version.includes('^') || version.includes('~')) {
    console.error(? Package  does not use exact version: );
    process.exit(1);
  }
});

// Verify critical packages
const criticalPackages = ['next', 'react', 'react-dom', 'date-fns'];
criticalPackages.forEach(pkg => {
  if (!packageJson.dependencies[pkg]) {
    console.error(? Critical package missing: );
    process.exit(1);
  }
});

console.log('? All dependencies validated successfully');
