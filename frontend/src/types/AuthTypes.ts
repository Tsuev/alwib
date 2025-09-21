export interface UserAuthType {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface User {
  id: number
  email: string
  role: string
  createdAt: string
}

export interface AuthResponse {
  message: string
  user: User
}

export interface ProfileResponse {
  user: User
}

export interface VerifyResponse {
  valid: boolean
  user: User
}
