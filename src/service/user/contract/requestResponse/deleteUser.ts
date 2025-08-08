export class DeleteUserRequest {
  constructor(public readonly id: number) {}
}

export class DeleteUserResponse {
  constructor(public readonly success: boolean) {}
} 