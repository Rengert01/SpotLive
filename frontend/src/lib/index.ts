
export const validatePasswordSpecialCharacter = (password: any) => {
    if (password?.match(/[!@#$.%^&*_=+-]/g)) {
        return true;
    } else {
        return false;
    }
};

export const validatePasswordUpperCase = (password: any) => {
    if (password?.match(/[A-Z]+/g)) {
        return true;
    } else {
        return false;
    }
};

export const validatePasswordLowercase = (password: any) => {
    if (password?.match(/[a-z]+/g)) {
        return true;
    } else {
        return false;
    }
};

export const validatePasswordLength = (password: any) => {
    if (password?.length > 7) {
        return true;
    } else {
        return false;
    }
};

export const validatePasswordNumber = (password: any) => {
    if (password?.match(/[0-9]+/g)) {
        return true;
    } else {
        return false;
    }
};
