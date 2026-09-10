import nextTypescript from 'eslint-config-next/typescript';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      semi: `off`,
      [`prefer-const`]: `off`,
      [`no-extra-semi`]: `off`,
      [`react-hooks/refs`]: `off`,
      [`react-hooks/purity`]: `off`,
      [`react-hooks/exhaustive-deps`]: `off`,
      [`jsx-a11y/aria-proptypes`]: `off`,
      [`@next/next/no-img-element`]: `off`,
      [`react-hooks/set-state-in-effect`]: `off`,
      [`react-hooks/preserve-manual-memoization`]: `off`,
      [`@typescript-eslint/no-extra-semi`]: `off`,
      [`@typescript-eslint/no-unused-vars`]: `off`,
      [`@typescript-eslint/no-explicit-any`]: `off`,
      [`@typescript-eslint/no-empty-function`]: `off`,
      [`@typescript-eslint/no-inferrable-types`]: `off`,
      [`@typescript-eslint/no-unused-expressions`]: `off`,
      [`@typescript-eslint/no-duplicate-enum-values`]: `off`
    },
  },
];

export default eslintConfig;
