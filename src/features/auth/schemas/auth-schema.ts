import { z } from 'zod';

// Password strength regex: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,72}$/;

const strongPasswordMessage =
  'Password must be 8–72 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&.#)';

export const loginSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  password: z
    .string({ message: 'Password is required' })
    .min(1, 'Password is required'),
  // Note: We don't validate password strength on login for security (avoid leaking rules)
});

export type TLoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string({ message: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .transform(val => val.replace(/\s+/g, ' ')) // normalize spaces
      .refine(val => val.trim().split(' ').length >= 1, {
        message: 'Name cannot be just whitespace',
      }),

    email: z
      .string({ message: 'Email is required' })
      .trim()
      .toLowerCase()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .refine(email => {
        // Block disposable/temporary emails (optional advanced check)
        const disposableDomains = [
          'tempmail.com',
          '10minutemail.com',
          'guerrillamail.com',
          'yopmail.com',
          // add more as needed
        ];
        const domain = email.split('@')[1];
        return domain ? !disposableDomains.includes(domain) : true;
      }, 'Disposable email addresses are not allowed'),

    password: z
      .string({ message: 'Password is required' })
      .min(8, strongPasswordMessage)
      .max(72, 'Password is too long')
      .regex(passwordRegex, strongPasswordMessage),

    confirmPassword: z
      .string({ message: 'Please confirm your password' })
      .min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  // Optional: Prevent common passwords (you can expand this list or use an API)
  .refine(
    data =>
      ![
        'password',
        '12345678',
        'qwerty123',
        data.email.split('@')[0]?.toLowerCase(),
      ].includes(data.password.toLowerCase()),
    {
      message: 'This password is too common or based on your email',
      path: ['password'],
    }
  );

export type TRegisterSchema = z.infer<typeof registerSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, strongPasswordMessage)
      .max(72)
      .regex(passwordRegex, strongPasswordMessage),
    confirmNewPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type TChangePasswordSchema = z.infer<typeof changePasswordSchema>;
const otpSchema = z.object({
  otp: z.string().length(6, 'Please enter all 6 digits'),
});

type TOtpFormData = z.infer<typeof otpSchema>;
export { otpSchema, type TOtpFormData };

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
