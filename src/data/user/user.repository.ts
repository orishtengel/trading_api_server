import { IUsersRepository } from './user.repository.interface';
import { UserEntity } from './contracts/user.entities';
import { 
  FindUserByIdRequest, 
  CreateUserRequest, 
  UpdateUserRequest, 
  DeleteUserRequest 
} from './contracts/requestResponse';

export class UsersRepository implements IUsersRepository {
  private readonly users: Map<number, UserEntity> = new Map();
  private nextId = 1;

  async findById(request: FindUserByIdRequest): Promise<UserEntity | null> {
    return this.users.get(request.id) ?? null;
    }

  async create(request: CreateUserRequest): Promise<UserEntity> {
    const now = new Date().toISOString();
    const entity: UserEntity = { 
      id: this.nextId++, 
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      role: request.role,
      permissions: request.permissions,
      created_at: now,
      updated_at: now
    };
    this.users.set(entity.id, entity);
    return entity;
  }

  async update(request: UpdateUserRequest): Promise<UserEntity | null> {
    const existing = this.users.get(request.id);
    if (!existing) return null;
    
    const updated: UserEntity = { 
      ...existing, 
      ...(request.email !== undefined && { email: request.email }),
      ...(request.firstName !== undefined && { firstName: request.firstName }),
      ...(request.lastName !== undefined && { lastName: request.lastName }),
      ...(request.role !== undefined && { role: request.role }),
      ...(request.permissions !== undefined && { permissions: request.permissions }),
      updated_at: new Date().toISOString()
    };
    this.users.set(request.id, updated);
    return updated;
  }

  async delete(request: DeleteUserRequest): Promise<boolean> {
    return this.users.delete(request.id);
  }
} 