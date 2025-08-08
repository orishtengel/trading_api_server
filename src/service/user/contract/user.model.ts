export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}

export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}

export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
} 