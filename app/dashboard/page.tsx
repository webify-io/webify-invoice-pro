import { Suspense } from 'react';
import { DashboardBlocks } from '../components/DashboardBlocks';
import { EmptyState } from '../components/EmptyState';
import { InvoiceGraph } from '../components/InvoiceGraph';
import { RecentInvoices } from '../components/RecentInvoices';
import { SkeletonInvoiceList } from '../components/SkeletonInvoiceList';
import prisma from '../utils/db';
import { requireUser } from '../utils/hooks';

//function to check if user has any invoices
async function getData(userId: string) {
	const data = await prisma.invoice.findMany({
		where: {
			userId: userId,
		},
		select: {
			id: true,
		},
	});

	return data;
}

export default async function DashboardRoute() {
	const session = await requireUser();
	const data = await getData(session.user?.id as string);

	return (
		<>
			{data.length < 1 ? (
				<>
					<EmptyState
						title="Please create an Invoice"
						description="Hey you have not created any invoices. Please create one."
						buttontext="Create Invoice"
						href="/dashboard/invoices/create"
					/>
				</>
			) : (
				<Suspense fallback={<SkeletonInvoiceList />}>
					<DashboardBlocks />
					<div className="flex flex-col md:grid gap-4 lg:grid-cols-3 md:gap-8">
						<InvoiceGraph />
						<RecentInvoices />
					</div>
				</Suspense>
			)}
		</>
	);
}
