import { ITwitterUser } from '../schemas/twitApi';

export interface IUser {
  name?: string;
  token?: string;
  tokenSecret?: string;
  notificationUsers?: Array<ITwitterUser>;
}