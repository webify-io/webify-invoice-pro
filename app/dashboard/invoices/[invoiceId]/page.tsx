import { EditInvoice } from '@/app/components/EditInvoice';
import prisma from '@/app/utils/db';
import { requireUser } from '@/app/utils/hooks';
import { notFound } from 'next/navigation';

async function getData(invoiceId: string, userId: string) {
	const data = await prisma.invoice.findUnique({
		where: {
			id: invoiceId,
			userId: userId,
		},
	});

	if (!data) {
		return notFound(); //notFound returns a 404
	}

	return data;
}

type ParamsInvoiceId = Promise<{ invoiceId: string }>;

export default async function EditInvoiceRoute({
	params,
}: {
	params: ParamsInvoiceId;
}) {
	const { invoiceId } = await params;
	const session = await requireUser();
	const data = await getData(invoiceId, session.user?.id as string);

	return <EditInvoice data={data} />;
}
