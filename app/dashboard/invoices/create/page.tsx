import { CreateInvoice } from '@/app/components/CreateInvoice';
import prisma from '@/app/utils/db';
import { requireUser } from '@/app/utils/hooks';

async function getUserData(userId: string) {
	const data = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			fisrtName: true,
			lastName: true,
			address: true,
			email: true,
		},
	});

	return data;
}

export default async function InvoiceCreationRoute() {
	const session = await requireUser();
	const data = await getUserData(session.user?.id as string);
	return (
		<CreateInvoice
			lastName={data?.lastName as string}
			address={data?.address as string}
			firstName={data?.fisrtName as string}
			email={data?.email as string}
		/>
	);
}
