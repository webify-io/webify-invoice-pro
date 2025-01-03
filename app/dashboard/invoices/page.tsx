import { InvoiceList } from '@/app/components/InvoiceList';
import { SkeletonInvoiceList } from '@/app/components/SkeletonInvoiceList';
import { buttonVariants } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default function InvoicesRoute() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-2xl font-bold">Invoices</CardTitle>
						<CardDescription>Manage your Invoices right here</CardDescription>
					</div>
					<div>
						<Link
							href="/dashboard/invoices/create"
							className={buttonVariants()}
						>
							<PlusIcon />
							Create Invoice
						</Link>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<Suspense fallback={<SkeletonInvoiceList />}>
					<InvoiceList />
				</Suspense>
			</CardContent>
		</Card>
	);
}
