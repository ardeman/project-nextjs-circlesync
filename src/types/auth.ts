export type TSignInRequest = {
  email: string
  password: string
}

export type TSignUpRequest = {
  displayName: string
  email: string
  password: string
  confirmPassword: string
}

export type TUpdateProfileRequest = {
  displayName: string
}

export type TEmailRequest = {
  email: string
}
