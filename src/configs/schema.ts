// Next.js 15 - src/configs/schema.ts
import pkg from '../../package.json';

const SITE_URL = 'https://flyffskillsimulator.vercel.app';
const SITE_NAME = 'Flyff Universe Skill Simulator';
const FULL_TITLE =
    'Flyff Universe Skill Simulator - Plan Your Character Skill Build';
const DESCRIPTION =
    'Free online Flyff Universe Skill Simulator. Plan and visualize your character skill builds with our interactive skill tree. Raise prerequisites in one click, share builds via URL or file, and explore every class.';

/**
 * JSON-LD graph for SEO (Schema.org).
 * `softwareVersion` and `dateModified` are sourced from package.json.
 */
export const JSON_LD_SCHEMA = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: SITE_NAME,
            description: DESCRIPTION,
            inLanguage: [
                'en',
                'th',
                'ja',
                'vi',
                'zh-CN',
                'pt-BR',
                'de',
                'fr',
                'id',
                'ko',
                'es'
            ],
            publisher: {
                '@id': `${SITE_URL}/#person`
            }
        },
        {
            '@type': 'WebApplication',
            '@id': `${SITE_URL}/#app`,
            url: SITE_URL,
            name: FULL_TITLE,
            alternateName: SITE_NAME,
            description: DESCRIPTION,
            applicationCategory: 'GameApplication',
            applicationSubCategory: 'Skill Simulator',
            operatingSystem: 'Web Browser',
            browserRequirements: 'Requires JavaScript. Requires HTML5.',
            softwareVersion: pkg.version,
            dateModified: pkg.updated.replace(/\//g, '-'),
            isAccessibleForFree: true,
            inLanguage: [
                'en',
                'th',
                'ja',
                'vi',
                'zh-CN',
                'pt-BR',
                'de',
                'fr',
                'id',
                'ko',
                'es'
            ],
            image: `${SITE_URL}/metadata/manifest.png`,
            screenshot: [
                `${SITE_URL}/metadata/demo-desktop.png`,
                `${SITE_URL}/metadata/demo-mobile.png`
            ],
            featureList: [
                'Interactive skill tree for all Flyff Universe classes',
                'One-click raise prerequisites for locked skills',
                'Build sharing via URL and JSON file import/export',
                'Multi-language support (11 languages)',
                'Character level and skill point calculator',
                'Theme customization and PWA support'
            ],
            author: {
                '@id': `${SITE_URL}/#person`
            },
            creator: {
                '@id': `${SITE_URL}/#person`
            },
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock'
            }
        },
        {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: 'MeteorVIIx',
            url: 'https://github.com/guysuvijak',
            sameAs: [
                'https://github.com/guysuvijak',
                'https://ko-fi.com/guysuvijak'
            ]
        },
        {
            '@type': 'SoftwareSourceCode',
            '@id': `${SITE_URL}/#source`,
            name: SITE_NAME,
            codeRepository: 'https://github.com/guysuvijak/flyff-skill-simulator',
            programmingLanguage: ['TypeScript', 'JavaScript'],
            runtimePlatform: 'Next.js',
            license: 'https://opensource.org/licenses/MIT',
            version: pkg.version,
            author: {
                '@id': `${SITE_URL}/#person`
            }
        }
    ]
};
