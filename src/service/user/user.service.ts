import { IUsersService } from './user.service.interface';
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
import { IUsersRepository } from '@data/user/user.repository.interface';
import { 
  mapUserEntityToModel, 
  mapCreateUserInputToDataRequest, 
  mapUpdateUserInputToDataRequest,
  mapIdToFindByIdRequest,
  mapIdToDeleteRequest
} from './mapper/user.mapper';

export class UsersService implements IUsersService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async getById(request: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const dataRequest = mapIdToFindByIdRequest(request.id);
    const entity = await this.usersRepository.findById(dataRequest);
    const user = entity ? mapUserEntityToModel(entity) : null;
    return new GetUserByIdResponse(user);
  }

  async create(request: CreateUserRequest): Promise<CreateUserResponse> {
    const dataRequest = mapCreateUserInputToDataRequest(request);
    const created = await this.usersRepository.create(dataRequest);
    const user = mapUserEntityToModel(created);
    return new CreateUserResponse(user);
  }

  async update(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const dataRequest = mapUpdateUserInputToDataRequest(request.id, request);
    const updated = await this.usersRepository.update(dataRequest);
    const user = updated ? mapUserEntityToModel(updated) : null;
    return new UpdateUserResponse(user);
  }

  async delete(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    const dataRequest = mapIdToDeleteRequest(request.id);
    const success = await this.usersRepository.delete(dataRequest);
    return new DeleteUserResponse(success);
  }
}
