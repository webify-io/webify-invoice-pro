import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { InvoiceActions } from './InvoiceAcrtions';

export function InvoiceList() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Invoice ID</TableHead>
					<TableHead>Customer</TableHead>
					<TableHead>Amount</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Date</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>#1</TableCell>
					<TableCell>Tester McTestee</TableCell>
					<TableCell>R2354.23</TableCell>
					<TableCell>Paid</TableCell>
					<TableCell>10/12/2024</TableCell>
					<TableCell className="text-right">
						<InvoiceActions />
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
