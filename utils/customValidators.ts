const nonAlphabeticRegex = /[^a-zA-Z ]/;
const iranPhoneRegex = /^(\+98|0)?9\d{9}$|^0\d{2,3}\d{7,8}$/ 
export function isNameInvalid(name: string): boolean {
  return nonAlphabeticRegex.test(name);
}

export function isPhoneNumberValid(number:string) {
  return iranPhoneRegex.test(number)
}