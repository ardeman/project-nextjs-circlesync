type TFirebaseAuthError = {
  code: string
  message?: string
  action?: string
}

export const firebaseAuthError: TFirebaseAuthError[] = [
  {
    code: 'auth/email-already-in-use',
    action: 'signin',
  },
  {
    code: 'auth/invalid-credential',
    message: 'Invalid credential',
  },
  {
    code: 'auth/weak-password',
    message: 'Weak password',
  },
  {
    code: 'auth/popup-closed-by-user',
    message: 'Popup closed by user',
  },
]
