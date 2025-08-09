import { User } from '@service/user/contract/user.model';

export class CreateUserRequest {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: string,
    public readonly permissions: string[]
  ) {}
}

export class CreateUserResponse {
  constructor(
    public readonly status: number,
    public readonly data?: User,
    public readonly error?: string
  ) {}
} 