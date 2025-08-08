export class User {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: string,
    public readonly permissions: string[]
  ) {}
}

export class CreateUserInput {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: string,
    public readonly permissions: string[]
  ) {}
}

export class UpdateUserInput {
  constructor(
    public readonly email?: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly role?: string,
    public readonly permissions?: string[]
  ) {}
} 