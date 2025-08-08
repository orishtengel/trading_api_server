import { User } from '@service/user/user.models';

export type GetUserByIdRequest = { id: number };
export type GetUserByIdResponse = { status: number; data?: User; error?: string };

export type ListUsersResponse = { status: number; data?: User[]; error?: string };

export type CreateUserRequest = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
};
export type CreateUserResponse = { status: number; data?: User; error?: string };

export type UpdateUserRequest = {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
};
export type UpdateUserResponse = { status: number; data?: User; error?: string };

export type DeleteUserRequest = { id: number };
export type DeleteUserResponse = { status: number; data?: { deleted: boolean }; error?: string }; 