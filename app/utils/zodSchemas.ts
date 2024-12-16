import { z } from 'zod';

export const onboardingSchema = z.object({
	firstName: z.string().min(3, 'First Name is required'),
	lastName: z.string().min(3, 'Last Name is required'),
	address: z.string().min(5, 'Address is required'),
});

export const invoiceSchema = z.object({
	invoiceName: z.string().min(1, 'Invoice Name is Required'),

	total: z.number().min(1, '1 Rand is minimum'),

	status: z.enum(['PAID', 'PENDING']).default('PENDING'),

	date: z.string().min(1, 'Date is required'),

	dueDate: z.number().min(1, 'Due Date is required'),

	fromName: z.string().min(1, 'Your Name is required'),

	fromEmail: z.string().email('Invalid Email Address'),

	fromAddress: z.string().min(1, 'Your Address is required'),

	clientName: z.string().min(1, 'Client Name is required'),

	clientEmail: z.string().email('Invalid Email Address'),

	clientAddress: z.string().min(1, 'Client Address is required'),

	currency: z.string().min(1, 'Currency is required'),

	invoiceNumber: z.number().min(1, 'Minimum invoice number of 1'),

	note: z.string().optional(),

	invoiceItemDescription: z.string().min(1, 'Description is required'),

	invoiceitemQuantity: z.number().min(1, 'Quanity min 1'),

	invoiceItemRate: z.number().min(1, 'Rate min 1'),
});
