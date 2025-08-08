import { User } from '@service/user/contract/user.model';

export class GetUserByIdRequest {
  constructor(public readonly id: string) {}
}

export class GetUserByIdResponse {
  constructor(
    public readonly status: number,
    public readonly data?: User,
    public readonly error?: string
  ) {}
} 