import { BaseEntity } from '../../core/baseEntity';

export interface UserEntity extends BaseEntity {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  permissions: string[];
} 