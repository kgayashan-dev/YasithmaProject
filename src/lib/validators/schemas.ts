import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Full name is required').max(120),
  customerEmail: z.string().email('Valid email address is required'),
  customerPhone: z
    .string()
    .regex(/^(?:\+94|0)?7[0-9]{8}$/, 'Enter a valid Sri Lankan mobile number (e.g., 076 764 4654)'),
  shippingAddress: z.string().min(5, 'Complete delivery address is required').max(300),
  city: z.string().min(2, 'City is required').max(80),
  district: z.string().min(2, 'District is required').max(80),
  postalCode: z.string().max(15).optional().or(z.literal('')),
  orderNotes: z.string().max(500).optional().or(z.literal('')),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'PAYHERE']),
  idempotencyKey: z.string().min(8).max(100),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1, 'Cart cannot be empty'),
});

export const productUpsertSchema = z.object({
  name: z.string().min(2).max(150),
  sinhalaName: z.string().max(150).optional().nullable(),
  botanicalName: z.string().max(150).optional().nullable(),
  slug: z.string().min(2).max(160),
  sku: z.string().min(2).max(60),
  categoryId: z.string().min(1),
  shortDescription: z.string().min(5).max(300),
  detailedDescription: z.string().min(10),
  ingredients: z.string().min(3),
  netWeight: z.string().min(1).max(40),
  priceLkr: z.number().positive(),
  isSamplePrice: z.boolean().default(false),
  stockQuantity: z.number().int().min(0),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  preparationUsage: z.string().optional().nullable(),
  storageInstructions: z.string().optional().nullable(),
  batchNumber: z.string().optional().nullable(),
  manufacturingDate: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
  imageUrl: z.string().min(1),
});

export const registerSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
