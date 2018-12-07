import { Document, Schema, Model, model } from 'mongoose';
import { IUser } from '../interfaces/user';

export interface IUserModel extends IUser, Document {}

export const UserSchema: Schema = new Schema({
  createdAt: Date,
  name: String,
  token: String,
  tokenSecret: String
});

UserSchema.pre('save', function(next: any) {
  let now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
