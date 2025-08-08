import { z } from 'zod';
import { IUsersManager } from './user.manager.interface';
import { CreateUserRequest, CreateUserResponse, DeleteUserRequest, DeleteUserResponse, GetUserByIdRequest, GetUserByIdResponse, ListUsersResponse, UpdateUserRequest, UpdateUserResponse } from './user.contracts';
import { IUsersService } from '@service/user/user.service.interface';

const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.string().min(1),
  permissions: z.array(z.string()).default([]),
});

const updateUserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  permissions: z.array(z.string()).optional(),
});

export class UsersManager implements IUsersManager {
  constructor(private readonly usersService: IUsersService) {}

  async getById(req: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    if (!Number.isInteger(req.id) || req.id <= 0) {
      return { status: 400, error: 'Invalid id' };
    }
    const user = await this.usersService.getById(req.id);
    if (!user) return { status: 404, error: 'User not found' };
    return { status: 200, data: user };
  }

  async list(): Promise<ListUsersResponse> {
    const users = await this.usersService.list();
    return { status: 200, data: users };
  }

  async create(req: CreateUserRequest): Promise<CreateUserResponse> {
    const parsed = createUserSchema.safeParse(req);
    if (!parsed.success) {
      return { status: 400, error: parsed.error.flatten().formErrors.join('; ') };
    }
    const created = await this.usersService.create(parsed.data);
    return { status: 201, data: created };
  }

  async update(req: UpdateUserRequest): Promise<UpdateUserResponse> {
    const parsed = updateUserSchema.safeParse(req);
    if (!parsed.success) {
      return { status: 400, error: parsed.error.flatten().formErrors.join('; ') };
    }
    const updated = await this.usersService.update(parsed.data.id, parsed.data);
    if (!updated) return { status: 404, error: 'User not found' };
    return { status: 200, data: updated };
  }

  async delete(req: DeleteUserRequest): Promise<DeleteUserResponse> {
    if (!Number.isInteger(req.id) || req.id <= 0) {
      return { status: 400, error: 'Invalid id' };
    }
    const deleted = await this.usersService.delete(req.id);
    if (!deleted) return { status: 404, error: 'User not found' };
    return { status: 200, data: { deleted: true } };
  }
}
