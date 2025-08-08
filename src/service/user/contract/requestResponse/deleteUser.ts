export class DeleteUserRequest {
  constructor(public readonly id: string) {}
}

export class DeleteUserResponse {
  constructor(public readonly success: boolean) {}
} 