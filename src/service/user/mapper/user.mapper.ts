import { UserEntity } from '@data/user/contracts/user.entities';
import { User, CreateUserInput, UpdateUserInput } from '../contract/user.model';
import { 
  FindUserByIdRequest, 
  CreateUserRequest as DataCreateUserRequest, 
  UpdateUserRequest as DataUpdateUserRequest, 
  DeleteUserRequest 
} from '@data/user/contracts/requestResponse';

export function mapUserEntityToModel(entity: UserEntity): User {
  return new User(
    entity.id,
    entity.email,
    entity.firstName,
    entity.lastName,
    entity.role,
    [...entity.permissions]
  );
}

export function mapCreateUserInputToDataRequest(input: CreateUserInput): DataCreateUserRequest {
  return new DataCreateUserRequest(
    input.email,
    input.firstName, // service firstName -> data first_name
    input.lastName,  // service lastName -> data last_name
    input.role,
    input.permissions
  );
}

export function mapUpdateUserInputToDataRequest(id: string, input: UpdateUserInput): DataUpdateUserRequest {
  return new DataUpdateUserRequest(
    id,
    input.firstName, // service firstName -> data first_name
    input.lastName,  // service lastName -> data last_name
    input.role,
    input.permissions
  );
}

export function mapIdToFindByIdRequest(id: string): FindUserByIdRequest {
  return new FindUserByIdRequest(id);
}

export function mapIdToDeleteRequest(id: string): DeleteUserRequest {
  return new DeleteUserRequest(id);
} 