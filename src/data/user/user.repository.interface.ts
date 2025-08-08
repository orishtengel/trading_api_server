import { UserEntity } from './contracts/user.entities';
import { 
  FindUserByIdRequest, 
  CreateUserRequest, 
  UpdateUserRequest, 
  DeleteUserRequest 
} from './contracts/requestResponse';

export interface IUsersRepository {
  findById(request: FindUserByIdRequest): Promise<UserEntity | null>;
  create(request: CreateUserRequest): Promise<UserEntity>;
  update(request: UpdateUserRequest): Promise<UserEntity | null>;
  delete(request: DeleteUserRequest): Promise<boolean>;
} 