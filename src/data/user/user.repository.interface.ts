import { UserEntity } from './user.entities';

export interface IUsersRepository {
  findById(id: number): Promise<UserEntity | null>;
  list(): Promise<UserEntity[]>;
  create(input: Omit<UserEntity, 'id'>): Promise<UserEntity>;
  update(id: number, input: Partial<Omit<UserEntity, 'id'>>): Promise<UserEntity | null>;
  delete(id: number): Promise<boolean>;
} 