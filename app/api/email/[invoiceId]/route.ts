import prisma from '@/app/utils/db';
import { requireUser } from '@/app/utils/hooks';
import { emailClient } from '@/app/utils/mailtrap';
import { NextResponse } from 'next/server';

export async function POST(
	request: Request,
	{
		params,
	}: {
		params: Promise<{ invoiceId: string }>;
	}
) {
	try {
		const session = await requireUser();

		const { invoiceId } = await params;

		const invoiceData = await prisma.invoice.findUnique({
			where: {
				id: invoiceId,
				userId: session.user?.id,
			},
		});

		if (!invoiceData) {
			return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
		}

		// Send reminder email using Mailtrap API:
		const sender = {
			email: 'hello@email.webify.org.za',
			name: 'InvoicePro by Webify',
		};
		const recipients = [
			{
				email: invoiceData.clientEmail,
			},
		];

		emailClient.send({
			from: sender,
			to: recipients,
			template_uuid: '49c6baf7-c94e-47aa-ac2c-9ab3157e4e96',
			template_variables: {
				first_name: invoiceData.clientName,
				company_info_name: 'Webify',
				company_info_address: 'Soweto Business Empowerment Zone',
				company_info_city: 'Johannesburg',
				company_info_zip_code: '2001',
				company_info_country: 'South Africa',
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to send email reminder' },
			{ status: 500 }
		);
	}
}
