import { z } from 'zod';

export const onboardingSchema = z.object({
	firstName: z.string().min(3, 'First Name is required'),
	lastName: z.string().min(3, 'Last Name is required'),
	address: z.string().min(5, 'Address is required'),
});
