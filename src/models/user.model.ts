export class User {
  id: string;
  mobilePhoneNumber?: string;
  username: string;
  mobilePhoneVerified: boolean;
  nickname?: string;
  password?: string;
  avatar?: string;
  email?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
