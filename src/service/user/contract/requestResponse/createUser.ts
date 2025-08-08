import { User } from '../user.model';

export class CreateUserRequest {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: string,
    public readonly permissions: string[]
  ) {}
}

export class CreateUserResponse {
  constructor(public readonly user: User) {}
} 