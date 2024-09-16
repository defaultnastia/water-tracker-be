export const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// at least 1 letter and 1 number (from 6 to 12 characters)
export const passwordRegexp = /^(?=.*[0-9])(?=.*[a-z])(?!.* ).{6,12}$/;
