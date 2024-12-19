import ReopenInvoice from '@/app/components/ReopenInvoice';
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

export default async function ReopenInvoiceRoute({
	params,
}: {
	params: ParamsInvoiceId;
}) {
	const { invoiceId } = await params;
	const session = await requireUser();
	const data = await getData(invoiceId, session.user?.id as string);

	return <ReopenInvoice data={data} params={params} />;
}
