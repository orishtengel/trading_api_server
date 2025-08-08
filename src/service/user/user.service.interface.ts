import {
  GetUserByIdRequest,
  GetUserByIdResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse
} from './contract/requestResponse';

export interface IUsersService {
  getById(request: GetUserByIdRequest): Promise<GetUserByIdResponse>;
  create(request: CreateUserRequest): Promise<CreateUserResponse>;
  update(request: UpdateUserRequest): Promise<UpdateUserResponse>;
  delete(request: DeleteUserRequest): Promise<DeleteUserResponse>;
}
