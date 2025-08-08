import { UserEntity } from '@data/user/user.entities';
import { User } from './user.models';

export function mapUserEntityToModel(entity: UserEntity): User {
  return {
    id: entity.id,
    email: entity.email,
    firstName: entity.first_name,
    lastName: entity.last_name,
    role: entity.role,
    permissions: [...entity.permissions],
  };
}

export function mapModelInputToEntityPartial(input: Partial<Omit<User, 'id'>>): Partial<UserEntity> {
  const out: Partial<UserEntity> = {};
  if (input.email !== undefined) out.email = input.email;
  if (input.firstName !== undefined) out.first_name = input.firstName;
  if (input.lastName !== undefined) out.last_name = input.lastName;
  if (input.role !== undefined) out.role = input.role;
  if (input.permissions !== undefined) out.permissions = [...input.permissions];
  return out;
} 