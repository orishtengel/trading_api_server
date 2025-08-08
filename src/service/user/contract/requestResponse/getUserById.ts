import { User } from '../user.model';

export class GetUserByIdRequest {
  constructor(public readonly id: number) {}
}

export class GetUserByIdResponse {
  constructor(public readonly user: User | null) {}
} 