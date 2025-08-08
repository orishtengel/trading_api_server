import { User } from '../user.model';

export class UpdateUserRequest {
  constructor(
    public readonly id: string,
    public readonly email?: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly role?: string,
    public readonly permissions?: string[]
  ) {}
}

export class UpdateUserResponse {
  constructor(public readonly user: User | null) {}
} 