const i18next = require('i18next');
const path = require('path');
const fs = require('fs');

// Load translations
const loadTranslations = () => {
    const localesDir = path.join(process.cwd(), 'locales');
    const resources = {};
    
    fs.readdirSync(localesDir).forEach(lang => {
        const langPath = path.join(localesDir, lang, 'translation.json');
        if (fs.existsSync(langPath)) {
            resources[lang] = {
                translation: require(langPath)
            };
        }
    });
    return resources;
};

// Initialize i18next
i18next.init({
    resources: loadTranslations(),
    fallbackLng: 'en',
    defaultNS: 'translation',
    interpolation: {
        escapeValue: false
    }
});

const localization = (req, res, next) => {
    let locale = req.headers['accept-language'];
    
    // Extract primary language from accept-language header
    if (locale) {
        locale = locale.split(',')[0].trim().split('-')[0];
    }
    
    // Default to 'en' if no valid locale
    locale = (locale && ['en', 'hi'].includes(locale)) ? locale : 'en';
    
    // Set locale for the request
    req.locale = locale;
    
    // Add translation function to request
    req.t = (key, options = {}) => {
        return i18next.t(key, { lng: locale, ...options });
    };
    
    next();
};



module.exports = localization

 