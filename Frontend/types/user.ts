export interface UserRegisterPayload {
  Username: string;
  UName: string;
  UEmail: string;
  UPhoneNumber: string;
  UPassword: string;
}

export interface UserSigninPayload {
  Username?: string;
  UEmail?: string;
  UPassword: string;
}

export interface UserUpdatePayload {
  Username: string;
  UName: string;
  UEmail: string;
  UPhoneNumber: string;
}

export interface UserAuth {
  UID: number;
  Username: string;
  UName: string;
  UEmail: string;
  UPhoneNumber: string;
}

export interface UserSigninResponse {
  success: boolean;
  user: UserAuth;
}
