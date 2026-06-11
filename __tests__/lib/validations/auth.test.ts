import { loginSchema, registerSchema, passwordResetSchema } from '@/lib/validations/auth'

describe('Auth Validations', () => {
  describe('loginSchema', () => {
    it('accepts valid login credentials', () => {
      const valid = {
        email: 'user@example.com',
        password: 'ValidPassword123!',
      }
      const result = loginSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const invalid = {
        email: 'not-an-email',
        password: 'ValidPassword123!',
      }
      const result = loginSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
      const invalid = {
        email: 'user@example.com',
        password: '',
      }
      const result = loginSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('trims and lowercases email', () => {
      const input = {
        email: '  USER@EXAMPLE.COM  ',
        password: 'ValidPassword123!',
      }
      const result = loginSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('user@example.com')
      }
    })
  })

  describe('registerSchema', () => {
    it('accepts valid registration data', () => {
      const valid = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      }
      const result = registerSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('rejects password without uppercase', () => {
      const invalid = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepass123!',
        confirmPassword: 'securepass123!',
      }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects password without number', () => {
      const invalid = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass!',
        confirmPassword: 'SecurePass!',
      }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects password without special character', () => {
      const invalid = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects mismatched passwords', () => {
      const invalid = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!',
      }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('rejects short name', () => {
      const invalid = {
        name: 'J',
        email: 'john@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('passwordResetSchema', () => {
    it('accepts valid password reset data', () => {
      const valid = {
        token: 'valid-token-123',
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      }
      const result = passwordResetSchema.safeParse(valid)
      expect(result.success).toBe(true)
    })

    it('rejects mismatched passwords', () => {
      const invalid = {
        token: 'valid-token-123',
        password: 'NewPassword123!',
        confirmPassword: 'DifferentPassword123!',
      }
      const result = passwordResetSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })
})
