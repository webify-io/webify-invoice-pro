import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CreditCard, DollarSign, UsersIcon } from 'lucide-react';
import prisma from '../utils/db';
import { requireUser } from '../utils/hooks';
import { formatCurrency } from '../utils/formatCurrency';

async function getData(userId: string) {
	//run all (multiple) queries to the db in parrellel
	const [data, openInvoices, paidInvoices] = await Promise.all([
		prisma.invoice.findMany({
			where: {
				userId: userId,
			},
			select: {
				total: true,
				currency: true,
			},
		}),
		prisma.invoice.findMany({
			where: {
				userId: userId,
				status: 'PENDING',
			},
			select: {
				id: true,
			},
		}),

		prisma.invoice.findMany({
			where: {
				userId: userId,
				status: 'PAID',
			},
			select: {
				id: true,
			},
		}),
	]);

	return {
		data,
		openInvoices,
		paidInvoices,
	};
}

export async function DashboardBlocks() {
	const session = await requireUser();

	const { data, openInvoices, paidInvoices } = await getData(
		session.user?.id as string
	);

	return (
		//wrapper div
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total Projected Revenue
					</CardTitle>
					<DollarSign className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-semibold">
						{formatCurrency({
							amount: data.reduce((acc, invoice) => acc + invoice.total, 0),
						})}
					</h2>
					<p className="text-xs text-muted-foreground">
						Based on the last 30 Days
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total Invoices Issued
					</CardTitle>
					<UsersIcon className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-bold">+{data.length}</h2>
					<p className="text-xs text-muted-foreground">
						Total Invoices which has been Send!
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
					<CreditCard className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-bold">+{paidInvoices.length}</h2>
					<p className="text-xs text-muted-foreground">
						Total Invoices which has been paid!
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Open Invoices</CardTitle>
					<Activity className="size-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<h2 className="text-2xl font-bold">+{openInvoices.length}</h2>
					<p className="text-xs text-muted-foreground">
						Invoices that have not been paid.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
