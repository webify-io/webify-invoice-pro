import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { SubmitButton } from './SubmitButton';
import { MarkAsPendingAction } from '../actions';
import { formatCurrency } from '../utils/formatCurrency';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireUser } from '../utils/hooks';
import prisma from '../utils/db';

// Function to check if an authorised user has access to the invoice:
async function authorizedUser(invoiceId: string, userId: string) {
	const data = await prisma.invoice.findUnique({
		where: {
			id: invoiceId,
			userId: userId,
		},
	});

	if (!data) {
		return redirect('/dashboard/invoices');
	}
}

type Params = Promise<{ invoiceId: string }>;

interface iAppProps {
	data: Prisma.InvoiceGetPayload<{}>;
	params: Params;
}

export default async function ReopenInvoice({ data, params }: iAppProps) {
	const { invoiceId } = await params;
	const session = await requireUser();

	await authorizedUser(invoiceId, session.user?.id as string);

	return (
		<Card className="w-full max-w-4xl mx-auto">
			<CardContent className="p-6">
				<form
					id="form"
					action={async () => {
						'use server';

						await MarkAsPendingAction(invoiceId);
					}}
					noValidate
				>
					<div className="flex flex-col gap-1 w-fit mb-6">
						<div className="flex items-center gap-4">
							<Badge variant="secondary">Draft</Badge>
							<Input
								defaultValue={data.invoiceName}
								placeholder="Test 123"
								disabled
							/>
						</div>
					</div>

					<div className="grid md:grid-cols-3 gap-6 mb-6">
						<div>
							<Label>Invoice No.</Label>
							<div className="flex">
								<span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
									#
								</span>
								<Input
									defaultValue={data.invoiceNumber}
									className="rounded-l-none"
									placeholder="5"
									disabled
								/>
							</div>
						</div>

						<div>
							<Label>Currency</Label>
							<Select defaultValue={data.currency} disabled>
								<SelectTrigger>
									<SelectValue placeholder="Select Currency" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ZAR">South Africa -- ZAR</SelectItem>
									<SelectItem value="USD">United States -- USD</SelectItem>
									<SelectItem value="EUR">Europe -- EUR</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-6 mb-6">
						<div>
							<Label>Invoice From</Label>
							<div className="space-y-2">
								<Input
									placeholder="Your Name"
									defaultValue={data.fromName}
									disabled
								/>
								<Input
									placeholder="Your Email"
									defaultValue={data.fromEmail}
									disabled
								/>
								<Input
									placeholder="Your Address"
									defaultValue={data.fromAddress}
									disabled
								/>
								{/* <p className="text-sm text-red-500">
									{fields.fromAddress.errors}
								</p> */}
							</div>
						</div>

						<div>
							<Label>Invoice Recipient</Label>
							<div className="space-y-2">
								<Input
									defaultValue={data.clientName}
									placeholder="Client Name"
									disabled
								/>

								<Input
									defaultValue={data.clientEmail}
									placeholder="Client Email"
									disabled
								/>

								<Input
									defaultValue={data.clientAddress}
									placeholder="Client Address"
									disabled
								/>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-6 mb-6">
						<div>
							<div>
								<Label>Date</Label>
							</div>

							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-[280px] text-left justify-start"
										disabled
									>
										<CalendarIcon />

										{data.date ? (
											new Intl.DateTimeFormat('en-US', {
												dateStyle: 'long',
											}).format(data.date)
										) : (
											<span>Pick a Date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent>
									<Calendar
										selected={data.date}
										mode="single"
										fromDate={new Date()}
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div>
							<Label>Invoice Due</Label>
							<Select defaultValue={data.dueDate.toString()} disabled>
								<SelectTrigger>
									<SelectValue placeholder="Select Due Date" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0">Due on Receipt</SelectItem>
									<SelectItem value="15">Net 15</SelectItem>
									<SelectItem value="30">Net 30</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div>
						<div className="grid grid-cols-12 gap-4 mb-2 font-medium">
							<p className="col-span-6">Description</p>
							<p className="col-span-2">Quantity</p>
							<p className="col-span-2">Rate</p>
							<p className="col-span-2">Amount</p>
						</div>

						<div className="grid grid-cols-12 gap-4 mb-4">
							<div className="col-span-6">
								<Textarea
									defaultValue={data.invoiceItemDescription}
									placeholder="Item Name"
									disabled
								/>
							</div>
							<div className="col-span-2">
								<Input
									type="number"
									placeholder="0"
									value={data.invoiceitemQuantity}
									disabled
								/>
							</div>
							<div className="col-span-2">
								<Input
									type="number"
									placeholder="0"
									value={data.invoiceItemRate}
									disabled
								/>
							</div>
							<div className="col-span-2">
								<Input
									value={formatCurrency({
										amount: data.total,
										currency: data.currency as any,
									})}
									placeholder="0"
									disabled
								/>
							</div>
						</div>
					</div>

					<div className="flex justify-end">
						<div className="w-1/3">
							<div className="flex justify-between py-2">
								<span>Subtotal</span>
								<span className="text-muted-foreground">
									{formatCurrency({
										amount: data.total,
										currency: data.currency as any,
									})}
								</span>
							</div>
							<div className="flex justify-between py-2 border-t">
								<span>Total ({data.currency})</span>
								<span className="font-medium underline underline-offset-4 text-muted-foreground">
									{formatCurrency({
										amount: data.total,
										currency: data.currency as any,
									})}
								</span>
							</div>
						</div>
					</div>

					<div>
						<Label>Note</Label>
						<Textarea
							defaultValue={data.note ?? undefined}
							placeholder="Add any additional information..."
							disabled
						/>
					</div>

					<div className="flex items-center justify-between mt-6">
						<Link
							className={buttonVariants({ variant: 'secondary' })}
							href="/dashboard/invoices"
						>
							Cancel
						</Link>

						<div>
							<SubmitButton text="Reopen Invoice" />
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
