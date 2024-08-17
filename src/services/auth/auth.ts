export function isAuthenticated (): boolean {
  return !!localStorage.getItem('token')
}

export function getToken (): string | null {
  return localStorage.getItem('token')
}

export function getUsername (): string | null {
  return localStorage.getItem('username')
}
