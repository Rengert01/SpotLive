import { z } from 'zod';

export const formSchema = z.object({
  username: z.string(),
  date_of_birth: z.date({
    message: 'Date is required',
  }),
  email: z.string().email({
    message: 'Enter a valid email.',
  }),
  gender: z.string().min(2, {
    message: 'Gender is required.',
  }),
  phone: z.string().min(2, {
    message: 'Phone number is required.',
  }),
});

export const addressSchema = z.object({
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  city: z.string(),
  state: z.string(),
  country: z.string(),
});
export const passwordSchema = z
  .object({
    password: z.string().min(5, {
      message: 'Password must be at least 5 characters.',
    }),
    password_confirmation: z.string().min(5, {
      message: 'Password confirmation must be at least 5 characters.',
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  });
