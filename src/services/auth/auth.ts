export function isAuthenticated (): boolean {
  return !!localStorage.getItem('login') && !!localStorage.getItem('password')
}

export function getToken (): string | null {
  return localStorage.getItem('token')
}

export function getUsername (): string | null {
  return localStorage.getItem('username')
}

export function setToken (token: string) {
  localStorage.setItem('token', token)
}

export function setUsername (username: string) {
  localStorage.setItem('username', username)
}

export function setLogin (login: string) {
  localStorage.setItem('login', login)
}

export function setPassword (password: string) {
  localStorage.setItem('password', password)
}

export function getLogin () {
  return localStorage.getItem('login')
}

export function getPassword () {
  return localStorage.getItem('password')
}
