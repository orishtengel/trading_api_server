import { CreateUserInput, UpdateUserInput, User } from './contract/user.model';

export interface IUsersService {
  getById(id: number): Promise<User | null>;
  list(): Promise<User[]>;
  create(input: CreateUserInput): Promise<User>;
  update(id: number, input: UpdateUserInput): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}
