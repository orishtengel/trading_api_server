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

  async list(): Promise<UserEntity[]> {
    return Array.from(this.users.values());
  }

  async create(request: CreateUserRequest): Promise<UserEntity> {
    const now = new Date().toISOString();
    const entity: UserEntity = { 
      id: this.nextId++, 
      email: request.email,
      first_name: request.first_name,
      last_name: request.last_name,
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
      ...(request.first_name !== undefined && { first_name: request.first_name }),
      ...(request.last_name !== undefined && { last_name: request.last_name }),
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