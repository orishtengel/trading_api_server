import { IUsersService } from './user.service.interface';
import { CreateUserInput, UpdateUserInput, User } from './contract/user.model';
import { IUsersRepository } from '@data/user/user.repository.interface';
import { mapModelInputToEntityPartial, mapUserEntityToModel } from './mapper/user.mapper';

export class UsersService implements IUsersService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async getById(id: number): Promise<User | null> {
    const entity = await this.usersRepository.findById(id);
    return entity ? mapUserEntityToModel(entity) : null;
  }

  async list(): Promise<User[]> {
    const entities = await this.usersRepository.list();
    return entities.map(mapUserEntityToModel);
  }

  async create(input: CreateUserInput): Promise<User> {
    const entityInput = mapModelInputToEntityPartial(input);
    const created = await this.usersRepository.create({
      email: entityInput.email!,
      first_name: entityInput.first_name!,
      last_name: entityInput.last_name!,
      role: entityInput.role!,
      permissions: entityInput.permissions ?? [],
    });
    return mapUserEntityToModel(created);
  }

  async update(id: number, input: UpdateUserInput): Promise<User | null> {
    const entityUpdate = mapModelInputToEntityPartial(input);
    const updated = await this.usersRepository.update(id, entityUpdate);
    return updated ? mapUserEntityToModel(updated) : null;
  }

  async delete(id: number): Promise<boolean> {
    return this.usersRepository.delete(id);
  }
}
