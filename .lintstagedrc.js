module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    () => 'tsc',
    () => 'next lint --fix',
  ],
  '*.css': 'prettier --write',
}
