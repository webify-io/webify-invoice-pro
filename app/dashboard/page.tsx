import { DashboardBlocks } from '../components/DashboardBlocks';
import { InvoiceGraph } from '../components/InvoiceGraph';
import { requireUser } from '../utils/hooks';

export default async function DashboardRoute() {
	const session = await requireUser();

	return (
		<>
			<DashboardBlocks />
			<div className="grid gap-4 lg:grid-cols-3 md:gap-8">
				<InvoiceGraph />
				<h1 className="bg-green-500 col-span-1">this is 30%</h1>
			</div>
		</>
	);
}
