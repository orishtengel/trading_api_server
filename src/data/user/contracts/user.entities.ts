import { BaseEntity } from '../../core/baseEntity';

export interface UserEntity extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
} 