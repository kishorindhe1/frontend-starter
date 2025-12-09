// src/schemas/common.schema.ts
import { z } from 'zod';

// ──────────────────────────────────────────────────────────────
// 1. STRING BASICS
// ──────────────────────────────────────────────────────────────
/**
 * A Zod schema that validates a non-empty string.
 *
 * This schema trims whitespace from the input string and ensures it has a minimum length of 1 character.
 * If the validation fails, it returns the error message "This field is required".
 *
 * @example
 * ```typescript
 * NonEmptyString.parse("  hello  "); // Returns "hello"
 * NonEmptyString.parse(""); // Throws ZodError with message "This field is required"
 * NonEmptyString.parse("   "); // Throws ZodError with message "This field is required"
 * ```
 */
export const NonEmptyString = z
  .string()
  .trim()
  .min(1, 'This field is required');

export const Trimmed = z.string().transform(v => v.trim());

export const Username = z
  .string()
  .min(3, 'Min 3 characters')
  .max(30, 'Max 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, _ and -')
  .transform(v => v.toLowerCase());

export const Slug = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens')
  .min(3)
  .max(100);

// ──────────────────────────────────────────────────────────────
// 2. NAME
// ──────────────────────────────────────────────────────────────
export const FullName = z
  .string()
  .min(2, 'Name too short')
  .max(60, 'Name too long')
  .transform(v => v.replace(/\s+/g, ' ').trim())
  .refine(v => v.trim().length > 0, 'Name is required');

export const FirstName = z
  .string()
  .min(2)
  .max(50)
  .regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters');

// ───────────────────────────────────────────────────────────────
// 3. EMAIL
// ─────────────────────────────────────
const disposableDomains = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'mailinator.com',
  'throwawaymail.com',
  'temp-mail.org',
  'sharklasers.com',
  'dispostable.com',
  'maildrop.cc',
  'tempail.com',
];

export const Email = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .transform(v => v.toLowerCase().trim());

export const NonDisposableEmail = Email.refine(
  val => {
    const domain = val.split('@')[1];
    return domain ? !disposableDomains.includes(domain) : true;
  },
  { message: 'Disposable/temporary emails are not allowed' }
);

// ─────────────────────────────────────────────────────────────
// 4. PASSWORD
// ─────────────────────────────────────────────
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,72}$/;

export const StrongPassword = z
  .string()
  .min(8, 'Minimum 8 characters')
  .max(72, 'Maximum 72 characters')
  .regex(
    strongPasswordRegex,
    'Must contain uppercase, lowercase, number and special character (@$!%*?&.#)'
  );

// Optional: prevent name/email in password
export const createStrongPasswordNoPersonal = (name: string, email: string) =>
  StrongPassword.refine(
    pwd => {
      const lower = pwd.toLowerCase();
      return (
        !lower.includes(name.toLowerCase()) &&
        !lower.includes(email.split('@')[0].toLowerCase())
      );
    },
    { message: 'Password cannot contain your name or email' }
  );

// ──────────────────────────────────────────────────────────────
// 5. PHONE
// ──────────────────────────────────────────────────────────────
export const PhoneE164 = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Use international format: +1234567890');

export const PhoneLenient = z
  .string()
  .transform(v => v.replace(/[^\d+]/g, ''))
  .refine(v => /^\+?[1-9]\d{1,14}$/.test(v), 'Invalid phone number');

// ──────────────────────────────────────────────────────────────
// 6. URL & WEBSITE
// ──────────────────────────────────────────────────────────────
export const Url = z.string().url('Invalid URL').or(z.literal(''));

export const HttpsUrl = Url.refine(url => !url || url.startsWith('https://'), {
  message: 'Must use HTTPS',
}).optional();

// ──────────────────────────────────────────────────────────────
// 7. DATE
// ──────────────────────────────────────────────────────────────
export const PastDate = z.coerce
  .date()
  .max(new Date(), 'Cannot be in the future');

export const FutureDate = z.coerce
  .date()
  .min(new Date(), 'Cannot be in the past');

export const BirthDate = z.coerce
  .date()
  .min(new Date('1900-01-01'), 'Year too early')
  .max(new Date(), 'Cannot be born in the future');

// ──────────────────────────────────────────────────────────────
// 8. NUMBERS
// ──────────────────────────────────────────────────────────────
export const PositiveNumber = z.number().positive('Must be > 0');

export const PositiveInteger = z.number().int().positive();

export const Price = z.number().min(0).multipleOf(0.01, 'Max 2 decimal places');

// ──────────────────────────────────────────────────────────────
// 9. FILE / UPLOAD
// ──────────────────────────────────────────────────────────────
export const ImageFile = z
  .instanceof(File)
  .refine(f => f.size <= 5 * 1024 * 1024, 'Max 5MB')
  .refine(
    f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
    'Only JPG, PNG, WebP'
  );

export const PdfFile = z
  .instanceof(File)
  .refine(f => f.size <= 10 * 1024 * 1024, 'Max 10MB')
  .refine(f => f.type === 'application/pdf', 'Only PDF');

// ──────────────────────────────────────────────────────────────
// 10. IDs
// ──────────────────────────────────────────────────────────────
export const MongoId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ID');

export const Uuid = z.string().uuid('Invalid UUID');

// ──────────────────────────────────────────────────────────────
// 11. COMMON REFINERS / HELPERS
// ──────────────────────────────────────────────────────────────
export const PasswordMatch = (passwordField: string) =>
  z.string().superRefine((val, ctx) => {
    const parent = ctx as unknown as { parent?: Record<string, unknown> };
    if (val !== parent.parent?.[passwordField]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
      });
    }
  });
export const DifferentFromCurrent = (
  currentPasswordField = 'currentPassword'
) =>
  z.string().superRefine((val, ctx) => {
    const parent = ctx as unknown as { parent?: Record<string, unknown> };
    if (val === parent.parent?.[currentPasswordField]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'New password must be different',
      });
    }
  });

export const NotCommonPassword = z.string().refine(
  pwd => {
    const common = ['password', '123456', '12345678', 'qwerty', 'abc123'];
    return !common.includes(pwd.toLowerCase());
  },
  { message: 'Password too common' }
);

// ──────────────────────────────────────────────────────────────
// EXPORT EVERYTHING
// ──────────────────────────────────────────────────────────────
const CommonSchemas = {
  NonEmptyString,
  Trimmed,
  Username,
  Slug,
  FullName,
  FirstName,
  Email,
  NonDisposableEmail,
  StrongPassword,
  createStrongPasswordNoPersonal,
  PhoneE164,
  PhoneLenient,
  Url,
  HttpsUrl,
  PastDate,
  FutureDate,
  BirthDate,
  PositiveNumber,
  PositiveInteger,
  Price,
  ImageFile,
  PdfFile,
  MongoId,
  Uuid,
  PasswordMatch,
  DifferentFromCurrent,
  NotCommonPassword,
} as const;

export default CommonSchemas;
