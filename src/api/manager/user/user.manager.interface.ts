import { CreateUserRequest, CreateUserResponse, GetUserByIdRequest, GetUserByIdResponse, ListUsersResponse, UpdateUserRequest, UpdateUserResponse, DeleteUserRequest, DeleteUserResponse } from './user.contracts';

export interface IUsersManager {
  getById(req: GetUserByIdRequest): Promise<GetUserByIdResponse>;
  list(): Promise<ListUsersResponse>;
  create(req: CreateUserRequest): Promise<CreateUserResponse>;
  update(req: UpdateUserRequest): Promise<UpdateUserResponse>;
  delete(req: DeleteUserRequest): Promise<DeleteUserResponse>;
}
