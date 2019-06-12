export function validEmail(value) {
    value = value.trim();
    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (value === '') {
        return { valid: false, error: 'please fill out this field' };
    }

    return emailRe.test(value) ? { valid: true, error: '' } : { valid: false, error: 'wrong email' };
};

export function validPassword(value) {
    const passwordRe = /^(.{8,})$/;

    if (value.trim() === '') {
        return { valid: false, error: 'please fill out this field' };
    }

    return passwordRe.test(value) ? { valid: true, error: '' } : { valid: false, error: 'password must be at least 8 characters long' };
};

export function validName(value) {
    value = value.trim();
    const nameRe = /^([a-zA-Z]|[а-яА-Я]){2,}$/;

    if (value === '') {
        return { valid: false, error: 'please fill out this field' };
    }

    if (value.length < 2) {
        return { valid: false, error: 'name must be at least 2 characters long' };
    }

    return nameRe.test(value) ? { valid: true, error: '' } : { valid: false, error: 'name must contain only latin and russian characters' };
};

export function validConfirmationPassword(value) {
    const { confirmationPassword, password } = value;

    if (confirmationPassword.trim() === '') {
        return { valid: false, error: 'please fill out this field' };
    }

    return confirmationPassword === password ? { valid: true, error: '' } : { valid: false, error: 'passwords do not match' };
}