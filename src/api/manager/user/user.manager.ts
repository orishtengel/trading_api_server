import { z } from 'zod';
import { IUsersManager } from './user.manager.interface';
import { CreateUserRequest, CreateUserResponse, DeleteUserRequest, DeleteUserResponse, GetUserByIdRequest, GetUserByIdResponse, UpdateUserRequest, UpdateUserResponse } from './user.contracts';
import { IUsersService } from '@service/user/user.service.interface';
import {
  GetUserByIdRequest as ServiceGetUserByIdRequest,
  CreateUserRequest as ServiceCreateUserRequest,
  UpdateUserRequest as ServiceUpdateUserRequest,
  DeleteUserRequest as ServiceDeleteUserRequest
} from '@service/user/contract/requestResponse';

const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().min(1),
  permissions: z.array(z.string()).default([]),
});

const updateUserSchema = z.object({
  id: z.string().email(), // ID is now email format
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  permissions: z.array(z.string()).optional(),
});

export class UsersManager implements IUsersManager {
  constructor(private readonly usersService: IUsersService) {}

  async getById(req: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    // Validate email format since ID is now email
    const emailValidation = z.string().email().safeParse(req.id);
    if (!emailValidation.success) {
      return new GetUserByIdResponse(400, undefined, 'Invalid email format for id');
    }
    const serviceRequest = new ServiceGetUserByIdRequest(req.id);
    const serviceResponse = await this.usersService.getById(serviceRequest);
    if (!serviceResponse.user) {
      return new GetUserByIdResponse(404, undefined, 'User not found');
    }
    return new GetUserByIdResponse(200, serviceResponse.user);
  }

  async create(req: CreateUserRequest): Promise<CreateUserResponse> {
    const parsed = createUserSchema.safeParse(req);
    if (!parsed.success) {
      return new CreateUserResponse(400, undefined, parsed.error.flatten().formErrors.join('; '));
    }
    const serviceRequest = new ServiceCreateUserRequest(
      parsed.data.email,
      parsed.data.firstName,
      parsed.data.lastName,
      parsed.data.role,
      parsed.data.permissions
    );
    const serviceResponse = await this.usersService.create(serviceRequest);
    return new CreateUserResponse(201, serviceResponse.user);
  }

  async update(req: UpdateUserRequest): Promise<UpdateUserResponse> {
    const parsed = updateUserSchema.safeParse(req);
    if (!parsed.success) {
      return new UpdateUserResponse(400, undefined, parsed.error.flatten().formErrors.join('; '));
    }
    const serviceRequest = new ServiceUpdateUserRequest(
      parsed.data.id,
      parsed.data.firstName,
      parsed.data.lastName,
      parsed.data.role,
      parsed.data.permissions
    );
    const serviceResponse = await this.usersService.update(serviceRequest);
    if (!serviceResponse.user) {
      return new UpdateUserResponse(404, undefined, 'User not found');
    }
    return new UpdateUserResponse(200, serviceResponse.user);
  }

  async delete(req: DeleteUserRequest): Promise<DeleteUserResponse> {
    // Validate email format since ID is now email
    const emailValidation = z.string().email().safeParse(req.id);
    if (!emailValidation.success) {
      return new DeleteUserResponse(400, undefined, 'Invalid email format for id');
    }
    const serviceRequest = new ServiceDeleteUserRequest(req.id);
    const serviceResponse = await this.usersService.delete(serviceRequest);
    if (!serviceResponse.success) {
      return new DeleteUserResponse(404, undefined, 'User not found');
    }
    return new DeleteUserResponse(200, { deleted: true });
  }
}
