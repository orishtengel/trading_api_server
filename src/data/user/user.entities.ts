export interface UserEntity {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  permissions: string[];
} 