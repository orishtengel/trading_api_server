export class UpdateUserRequest {
  constructor(
    public readonly id: number,
    public readonly email?: string,
    public readonly first_name?: string,
    public readonly last_name?: string,
    public readonly role?: string,
    public readonly permissions?: string[]
  ) {}
} 