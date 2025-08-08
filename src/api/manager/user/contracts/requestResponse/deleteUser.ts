export class DeleteUserRequest {
  constructor(public readonly id: string) {}
}

export class DeleteUserResponse {
  constructor(
    public readonly status: number,
    public readonly data?: { deleted: boolean },
    public readonly error?: string
  ) {}
} 