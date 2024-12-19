'use server';

import { requireUser } from './utils/hooks';
import { parseWithZod } from '@conform-to/zod';
import { invoiceSchema, onboardingSchema } from './utils/zodSchemas';
import prisma from './utils/db';
import { redirect } from 'next/navigation';
import { emailClient } from './utils/mailtrap';
import { formatCurrency } from './utils/formatCurrency';

export async function onboardUser(prevState: any, formData: FormData) {
	const session = await requireUser();

	const submission = parseWithZod(formData, {
		schema: onboardingSchema,
	});

	if (submission.status !== 'success') {
		return submission.reply();
	}

	const data = await prisma.user.update({
		where: {
			id: session.user?.id,
		},
		data: {
			fisrtName: submission.value.firstName,
			lastName: submission.value.lastName,
			address: submission.value.address,
		},
	});

	return redirect('/dashboard');
}

export async function createInvoice(prevState: any, formData: FormData) {
	const session = await requireUser();

	const submission = parseWithZod(formData, {
		schema: invoiceSchema,
	});

	if (submission.status !== 'success') {
		return submission.reply();
	}

	const data = await prisma.invoice.create({
		data: {
			clientAddress: submission.value.clientAddress,
			clientEmail: submission.value.clientEmail,
			clientName: submission.value.clientName,
			currency: submission.value.currency,
			date: submission.value.date,
			dueDate: submission.value.dueDate,
			fromAddress: submission.value.fromAddress,
			fromEmail: submission.value.fromEmail,
			fromName: submission.value.fromName,
			invoiceItemDescription: submission.value.invoiceItemDescription,
			invoiceitemQuantity: submission.value.invoiceitemQuantity,
			invoiceItemRate: submission.value.invoiceItemRate,
			invoiceName: submission.value.invoiceName,
			invoiceNumber: submission.value.invoiceNumber,
			status: submission.value.status,
			total: submission.value.total,
			note: submission.value.note,
			userId: session.user?.id,
		},
	});

	// Send client email using Mailtrap API:
	const sender = {
		email: 'hello@email.webify.org.za',
		name: 'InvoicePro by Webify',
	};
	const recipients = [
		{
			email: submission.value.clientEmail,
		},
	];

	emailClient.send({
		from: sender,
		to: recipients,
		template_uuid: '5828801c-5982-42a1-9903-a793f424bd34',
		template_variables: {
			clientName: submission.value.clientName,
			invoiceNumber: submission.value.invoiceNumber,
			invoiceDueDate: new Intl.DateTimeFormat('en-US', {
				dateStyle: 'long',
			}).format(new Date(submission.value.date)),
			invoiceAmount: formatCurrency({
				amount: submission.value.total,
				currency: submission.value.currency as any,
			}),
			invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
		},
	});

	return redirect('/dashboard/invoices');
}

// Edit Invoice Server Action:

export async function editInvoice(prevState: any, formData: FormData) {
	const session = await requireUser();

	// compare formData with zod schema
	const submission = parseWithZod(formData, {
		schema: invoiceSchema,
	});

	if (submission.status !== 'success') {
		return submission.reply();
	}

	// create mutation with prisma
	const data = await prisma.invoice.update({
		where: {
			id: formData.get('id') as string,
			userId: session.user?.id,
		},
		data: {
			clientAddress: submission.value.clientAddress,
			clientEmail: submission.value.clientEmail,
			clientName: submission.value.clientName,
			currency: submission.value.currency,
			date: submission.value.date,
			dueDate: submission.value.dueDate,
			fromAddress: submission.value.fromAddress,
			fromEmail: submission.value.fromEmail,
			fromName: submission.value.fromName,
			invoiceItemDescription: submission.value.invoiceItemDescription,
			invoiceitemQuantity: submission.value.invoiceitemQuantity,
			invoiceItemRate: submission.value.invoiceItemRate,
			invoiceName: submission.value.invoiceName,
			invoiceNumber: submission.value.invoiceNumber,
			status: submission.value.status,
			total: submission.value.total,
			note: submission.value.note,
		},
	});

	// Send updated email using Mailtrap API:
	const sender = {
		email: 'hello@email.webify.org.za',
		name: 'InvoicePro by Webify',
	};
	const recipients = [
		{
			email: submission.value.clientEmail,
		},
	];

	emailClient.send({
		from: sender,
		to: recipients,
		template_uuid: 'f5369939-cd3a-45dc-8aae-000c455625ac',
		template_variables: {
			clientName: submission.value.clientName,
			invoiceNumber: submission.value.invoiceNumber,
			invoiceDueDate: new Intl.DateTimeFormat('en-US', {
				dateStyle: 'long',
			}).format(new Date(submission.value.date)),
			invoiceAmount: formatCurrency({
				amount: submission.value.total,
				currency: submission.value.currency as any,
			}),
			invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
		},
	});

	return redirect('/dashboard/invoices');
}

// Create new Server Action: Delete invoice
export async function DeleteInvoice(invoiceId: string) {
	const session = await requireUser();

	const data = await prisma.invoice.delete({
		where: {
			userId: session.user?.id,
			id: invoiceId,
		},
	});

	return redirect('/dashboard/invoices');
}

// Create new Server Action: Update Invoice Status 'PAID'
export async function MarkAsPaidAction(invoiceId: string) {
	const session = await requireUser();

	const data = await prisma.invoice.update({
		where: {
			userId: session.user?.id,
			id: invoiceId,
		},
		data: {
			status: 'PAID',
		},
	});

	return redirect('/dashboard/invoices');
}

// Create new Server Action: Update Invoice Status 'PAID'
export async function MarkAsPendingAction(invoiceId: string) {
	const session = await requireUser();

	const data = await prisma.invoice.update({
		where: {
			userId: session.user?.id,
			id: invoiceId,
		},
		data: {
			status: 'PENDING',
		},
	});

	return redirect('/dashboard/invoices');
}
