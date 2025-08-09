import { User } from '@service/user/contract/user.model';

export class UpdateUserRequest {
  constructor(
    public readonly id: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly role?: string,
    public readonly permissions?: string[]
  ) {}
}

export class UpdateUserResponse {
  constructor(
    public readonly status: number,
    public readonly data?: User,
    public readonly error?: string
  ) {}
} 