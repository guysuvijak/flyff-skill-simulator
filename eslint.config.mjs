import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
    ...nextCoreWebVitals,
    {
        ignores: ['.next/**', 'node_modules/**', 'public/**']
    },
    {
        rules: {
            // Common Next.js patterns (mounted gate, prop sync) — warn until refactored
            'react-hooks/set-state-in-effect': 'warn'
        }
    }
];

export default eslintConfig;
