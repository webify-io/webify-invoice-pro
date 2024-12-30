import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Graph } from './Graph';
import prisma from '../utils/db';
import { requireUser } from '../utils/hooks';

//Function to retrieve data from db
async function getInvoices(userId: string) {
	const rawData = await prisma.invoice.findMany({
		where: {
			status: 'PAID',
			userId: userId,
			createdAt: {
				lte: new Date(),
				gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
			},
		},
		select: {
			createdAt: true,
			total: true,
		},
		orderBy: {
			createdAt: 'asc',
		},
	});

	//Method to group and aggregate data by date
	const aggregatedData = rawData.reduce(
		(acc: { [key: string]: number }, curr) => {
			//format the date to a short form date: month & date
			const date = new Date(curr.createdAt).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			});

			//add any payments made on the same date
			acc[date] = (acc[date] || 0) + curr.total;

			return acc;
		},
		{}
	);

	//method to convert the aggregatedData object to an array and format the object
	const transformedData = Object.entries(aggregatedData)
		.map(([date, amount]) => ({
			date,
			amount,
			//create an original date
			originalDate: new Date(date + ', ' + new Date().getFullYear()),
		}))
		//order entries chronologically using originalDate
		.sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
		.map(({ date, amount }) => ({ date, amount }));

	return transformedData;
}

export async function InvoiceGraph() {
	const session = await requireUser();
	const data = await getInvoices(session.user?.id as string);

	return (
		<Card className="lg:col-span-2">
			<CardHeader>
				<CardTitle>Paid Invoices</CardTitle>
				<CardDescription>
					Invoices which have been paid in the last 30 Days.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Graph data={data} />
			</CardContent>
		</Card>
	);
}
