// Auth utility — token is now stored in httpOnly cookie (managed by browser automatically)
// Frontend only stores non-sensitive user info (name, email, role) in localStorage
class AuthService {
  static USER_KEY = 'pyq_user'

  // Get user data from localStorage
  static getUser() {
    try {
      const user = localStorage.getItem(this.USER_KEY)
      return user ? JSON.parse(user) : null
    } catch (error) {
      console.error('User retrieval failed:', error)
      return null
    }
  }

  // Set user data in localStorage (no token — cookie handles it)
  static setUser(user) {
    if (!user) return false
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      return true
    } catch (error) {
      console.error('User storage failed:', error)
      return false
    }
  }

  // Clear user data from localStorage
  static clearAuth() {
    try {
      localStorage.removeItem(this.USER_KEY)
      // Clear any legacy keys from old localStorage-based auth
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('pyq_token')
      localStorage.removeItem('pyq_refresh')
    } catch (error) {
      console.error('Auth clear failed:', error)
    }
  }

  // Check authentication status based on stored user info
  // The actual token validity is enforced by the backend via httpOnly cookie
  static isAuthenticated() {
    return !!this.getUser()
  }

  // Logout — calls backend to clear the httpOnly cookie, then clears local user data
  static async logout() {
    try {
      await fetch((import.meta.env.VITE_API_URL || '') + '/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // sends the httpOnly cookie to backend
      })
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      this.clearAuth()
      window.location.href = '/login'
    }
  }

  // Handle auth errors (401 = cookie expired/invalid)
  static handleAuthError(error) {
    if (error.response?.status === 401) {
      console.warn('Authentication failed, logging out...')
      this.clearAuth()
      window.location.href = '/login'
      return true
    }
    return false
  }
}

export default AuthService