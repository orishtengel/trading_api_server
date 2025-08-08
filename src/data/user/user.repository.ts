import { IUsersRepository } from './user.repository.interface';
import { UserEntity } from './user.entities';

export class UsersRepository implements IUsersRepository {
  private readonly users: Map<number, UserEntity> = new Map();
  private nextId = 1;

  async findById(id: number): Promise<UserEntity | null> {
    return this.users.get(id) ?? null;
    }

  async list(): Promise<UserEntity[]> {
    return Array.from(this.users.values());
  }

  async create(input: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const entity: UserEntity = { id: this.nextId++, ...input };
    this.users.set(entity.id, entity);
    return entity;
  }

  async update(id: number, input: Partial<Omit<UserEntity, 'id'>>): Promise<UserEntity | null> {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated: UserEntity = { ...existing, ...input };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
} 