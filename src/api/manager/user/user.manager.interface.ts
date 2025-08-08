import { CreateUserRequest, CreateUserResponse, GetUserByIdRequest, GetUserByIdResponse, UpdateUserRequest, UpdateUserResponse, DeleteUserRequest, DeleteUserResponse } from './user.contracts';

export interface IUsersManager {
  getById(req: GetUserByIdRequest): Promise<GetUserByIdResponse>;
  create(req: CreateUserRequest): Promise<CreateUserResponse>;
  update(req: UpdateUserRequest): Promise<UpdateUserResponse>;
  delete(req: DeleteUserRequest): Promise<DeleteUserResponse>;
}
