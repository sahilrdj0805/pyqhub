import axios from 'axios'
import AuthService from './AuthService'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Always send httpOnly cookies with every request
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor — no token needed, cookie is sent automatically by browser
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle auth errors globally
    if (AuthService.handleAuthError(error)) {
      return Promise.reject(new Error('Authentication failed'))
    }
    return Promise.reject(error)
  }
)

// Admin API methods
export const AdminAPI = {
  // Get pending requests
  async getPendingRequests() {
    try {
      const response = await api.get('/admin/pending')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch pending requests')
    }
  },

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/stats')
      return response.data.stats || {
        totalUsers: 0,
        totalPYQs: 0,
        pendingRequests: 0,
        totalDownloads: 0,
        approvedToday: 0,
        rejectedToday: 0,
        popularSubjects: []
      }
    } catch (error) {
      return {
        totalUsers: 0,
        totalPYQs: 0,
        pendingRequests: 0,
        totalDownloads: 0,
        approvedToday: 0,
        rejectedToday: 0,
        popularSubjects: []
      }
    }
  },

  // Approve request
  async approveRequest(requestId) {
    try {
      const response = await api.put(`/admin/approve/${requestId}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to approve request')
    }
  },

  // Reject request
  async rejectRequest(requestId) {
    try {
      const response = await api.put(`/admin/reject/${requestId}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to reject request')
    }
  },

  // Get subjects
  async getSubjects() {
    try {
      const response = await api.get('/admin/subjects')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch subjects')
    }
  },

  // Admin direct upload PYQ (same as user upload)
  async uploadPYQ(formData) {
    try {
      const response = await api.post('/admin/upload-pyq', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000 // 2 minute timeout for uploads
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const response = await api.get('/admin/users')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch users')
    }
  },

  // Delete user
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to delete user')
    }
  },

  // Delete subject
  async deleteSubject(subjectId) {
    try {
      const response = await api.delete(`/admin/subjects/${subjectId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete subject')
    }
  },

  // Delete PYQ
  async deletePYQ(pyqId) {
    try {
      const response = await api.delete(`/admin/pyqs/${pyqId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete PYQ')
    }
  }
}

// Auth API methods
export const AuthAPI = {
  // User signup
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed')
    }
  },

  // User signin
  async signin(credentials) {
    try {
      const response = await api.post('/auth/signin', credentials)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  // Admin login
  async adminLogin(credentials) {
    try {
      const response = await api.post('/auth/admin/login', credentials)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Admin login failed')
    }
  },

  // Get current user
  async getMe() {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      throw new Error('Failed to get user info')
    }
  }
}

// separate axios instance for contact
const contactApi = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
  timeout: 10000,
  withCredentials: true, // send httpOnly cookies
  headers: {
    'Content-Type': 'application/json'
  }
})

// Contact API methods
export const ContactAPI = {
  // Send contact message
  async sendMessage(messageData) {
    try {
      const response = await contactApi.post('/contact', messageData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send message')
    }
  },

  // Get all contact messages (Admin only)
  async getAllMessages() {
    try {
      const response = await contactApi.get('/contact')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch messages')
    }
  },

  // Update message status (Admin only)
  async updateMessage(messageId, updateData) {
    try {
      const response = await contactApi.put(`/contact/${messageId}`, updateData)
      return response.data
    } catch (error) {
      throw new Error('Failed to update message')
    }
  },

  // Delete message (Admin only)
  async deleteMessage(messageId) {
    try {
      const response = await contactApi.delete(`/contact/${messageId}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to delete message')
    }
  },

  // Get contact stats (Admin only)
  async getContactStats() {
    try {
      const response = await contactApi.get('/contact/stats')
      return response.data
    } catch (error) {
      return {
        stats: {
          totalMessages: 0,
          unreadMessages: 0,
          repliedMessages: 0,
          recentMessages: 0
        }
      }
    }
  }
}

export default api