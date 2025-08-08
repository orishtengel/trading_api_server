import { User } from '../user.model';

export class GetUserByIdRequest {
  constructor(public readonly id: string) {}
}

export class GetUserByIdResponse {
  constructor(public readonly user: User | null) {}
} 