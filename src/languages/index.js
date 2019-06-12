import en from './en';
import ru from './ru';

function getMessages(language) {
    if (language === 'ru' || language === 'Русский') {
        return ru;
    }

    if (language === 'en' || language === 'English') {
        return en;
    }

    throw new Error('Unknown language');
}

export {
    en,
    ru,
    getMessages,
};
