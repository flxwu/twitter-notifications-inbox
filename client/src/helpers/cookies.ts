import { IUser } from '../schemas/user';

export const getCookie = (name: string): IUser | undefined => {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  const lastPart = parts.pop();
  if (lastPart) {
    const cookieString = lastPart.split(';').shift();
    if (cookieString) {
      return JSON.parse(cookieString);
    } else {
      return undefined;
    }
  }
  return undefined;
};
