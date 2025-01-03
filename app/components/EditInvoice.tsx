'use client';

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
import { useActionState, useState } from 'react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { invoiceSchema } from '../utils/zodSchemas';
import { editInvoice } from '../actions';
import { formatCurrency } from '../utils/formatCurrency';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

interface iAppProps {
	data: Prisma.InvoiceGetPayload<{}>;
}

export function EditInvoice({ data }: iAppProps) {
	// Client-Side Validation:
	const [lastResult, action] = useActionState(editInvoice, undefined);
	const [form, fields] = useForm({
		lastResult,

		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: invoiceSchema,
			});
		},

		shouldValidate: 'onBlur', // Validate the form once we click out of the input
		shouldRevalidate: 'onInput', // Revalidate when we click into the input again
	});

	const [selectedDate, setSelectedDate] = useState(data.date);
	const [rate, setRate] = useState(data.invoiceItemRate.toString());
	const [quantity, setQuantity] = useState(data.invoiceitemQuantity.toString());
	const [currency, setCurrency] = useState(data.currency);

	const calculateTotal = (Number(quantity) || 0) * (Number(rate) || 0);

	return (
		<Card className="w-full max-w-4xl mx-auto">
			<CardContent className="p-6">
				<form id={form.id} action={action} onSubmit={form.onSubmit} noValidate>
					{/* Create hidden input for Calender component for formData and Conform */}
					<input
						type="hidden"
						name={fields.date.name}
						value={selectedDate.toISOString()}
					/>
					{/* Make the total available for our formData  */}
					<input
						type="hidden"
						name={fields.total.name}
						value={calculateTotal}
					/>
					{/* Create input to make the formData Id available for the edit server action */}
					<input type="hidden" name="id" value={data.id} />

					<div className="flex flex-col gap-1 w-fit mb-6">
						<div className="flex items-center gap-4">
							<Badge variant="secondary">Draft</Badge>
							<Input
								name={fields.invoiceName.name}
								key={fields.invoiceName.key}
								defaultValue={data.invoiceName}
								placeholder="Company Name"
								className="text-sm"
							/>
						</div>
						<p className="text-sm text-red-500">{fields.invoiceName.errors}</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6 mb-6">
						<div>
							<Label>Invoice No.</Label>
							<div className="flex">
								<span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
									#
								</span>
								<Input
									name={fields.invoiceNumber.name}
									key={fields.invoiceNumber.key}
									defaultValue={data.invoiceNumber}
									className="rounded-l-none text-sm"
									placeholder="5"
								/>
							</div>
							<p className="text-sm text-red-500">
								{fields.invoiceNumber.errors}
							</p>
						</div>

						<div>
							<Label>Currency</Label>
							<Select
								defaultValue="ZAR"
								name={fields.currency.name}
								key={fields.currency.key}
								onValueChange={(value) => setCurrency(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Currency" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ZAR">South Africa -- ZAR</SelectItem>
									<SelectItem value="USD">United States -- USD</SelectItem>
									<SelectItem value="EUR">Europe -- EUR</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-sm text-red-500">{fields.currency.errors}</p>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-6 mb-6">
						<div>
							<Label>Invoice From</Label>
							<div className="space-y-2">
								<Input
									name={fields.fromName.name}
									key={fields.fromName.key}
									placeholder="Your Name"
									defaultValue={data.fromName}
									className="text-sm"
								/>
								<p className="text-sm text-red-500">{fields.fromName.errors}</p>
								<Input
									name={fields.fromEmail.name}
									key={fields.fromEmail.key}
									placeholder="Your Email"
									defaultValue={data.fromEmail}
									className="text-sm"
								/>
								<p className="text-sm text-red-500">
									{fields.fromEmail.errors}
								</p>
								<Input
									name={fields.fromAddress.name}
									key={fields.fromAddress.key}
									placeholder="Your Address"
									defaultValue={data.fromAddress}
									className="text-sm"
								/>
								<p className="text-sm text-red-500">
									{fields.fromAddress.errors}
								</p>
							</div>
						</div>

						<div>
							<Label>Invoice Recipient</Label>
							<div className="space-y-2">
								<Input
									name={fields.clientName.name}
									key={fields.clientName.key}
									defaultValue={data.clientName}
									placeholder="Client Name"
									className="text-sm"
								/>
								<p className="text-sm text-red-500">
									{fields.clientName.errors}
								</p>
								<Input
									name={fields.clientEmail.name}
									key={fields.clientEmail.key}
									defaultValue={data.clientEmail}
									placeholder="Client Email"
									className="text-sm"
								/>
								<p className="text-sm text-red-500">
									{fields.clientEmail.errors}
								</p>
								<Input
									name={fields.clientAddress.name}
									key={fields.clientAddress.key}
									defaultValue={data.clientAddress}
									placeholder="Client Address"
									className="text-sm"
								/>
								<p className="text-sm text-red-500">
									{fields.clientAddress.errors}
								</p>
							</div>
						</div>
					</div>

					<div className="flex flex-col md:grid md:grid-cols-2 gap-6 mb-6">
						<div>
							<div>
								<Label>Date</Label>
							</div>

							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-[280px] text-left justify-start"
									>
										<CalendarIcon />

										{selectedDate ? (
											new Intl.DateTimeFormat('en-US', {
												dateStyle: 'long',
											}).format(selectedDate)
										) : (
											<span>Pick a Date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent>
									<Calendar
										selected={selectedDate}
										onSelect={(date) => setSelectedDate(date || new Date())}
										mode="single"
										fromDate={new Date()}
									/>
								</PopoverContent>
							</Popover>
							<p className="text-sm text-red-500">{fields.date.errors}</p>
						</div>

						<div>
							<Label>Invoice Due</Label>
							<Select
								name={fields.dueDate.name}
								key={fields.dueDate.key}
								defaultValue={data.dueDate.toString()}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Due Date" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0">Due on Receipt</SelectItem>
									<SelectItem value="15">Net 15</SelectItem>
									<SelectItem value="30">Net 30</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-sm text-red-500">{fields.dueDate.errors}</p>
						</div>
					</div>

					<div>
						<div className="hidden md:grid md:grid-cols-12 gap-4 mb-2 text-sm font-medium text-nowrap">
							<p className="col-span-6">Description</p>
							<p className="col-span-2">Quantity</p>
							<p className="col-span-2">Rate</p>
							<p className="col-span-2">Amount</p>
						</div>

						<div className="flex flex-col md:grid md:grid-cols-12 gap-4 mb-4">
							<div className="col-span-6">
								<Label className="md:hidden font-medium">Description</Label>
								<Textarea
									name={fields.invoiceItemDescription.name}
									key={fields.invoiceItemDescription.key}
									defaultValue={data.invoiceItemDescription}
									placeholder="Invoice Description"
									className="text-sm"
								/>
								<p className="text-sm text-red-500">
									{fields.invoiceItemDescription.errors}
								</p>
							</div>
							<div className="col-span-2">
								<Label className="md:hidden font-medium">Quantity</Label>
								<Input
									name={fields.invoiceitemQuantity.name}
									key={fields.invoiceitemQuantity.key}
									type="number"
									placeholder="0"
									value={quantity}
									onChange={(e) => setQuantity(e.target.value)}
									className="text-sm"
								/>
								<p className="text-sm text-red-500">
									{fields.invoiceitemQuantity.errors}
								</p>
							</div>
							<div className="col-span-2">
								<Label className="md:hidden font-medium">Rate</Label>
								<Input
									name={fields.invoiceItemRate.name}
									key={fields.invoiceItemRate.key}
									type="number"
									placeholder="0"
									value={rate}
									onChange={(e) => setRate(e.target.value)}
									className="text-sm"
								/>
								<p className="text-sm text-red-500">
									{fields.invoiceItemRate.errors}
								</p>
							</div>
							<div className="col-span-2">
								<Label className="md:hidden font-medium">Amount</Label>
								<Input
									value={formatCurrency({
										amount: calculateTotal,
										currency: currency as any,
									})}
									placeholder="0"
									disabled
									className="text-sm"
								/>
							</div>
						</div>
					</div>

					<div className="flex justify-end text-sm">
						<div className="md:w-1/3">
							<div className="flex justify-between py-2">
								<span>Subtotal</span>
								<span>
									{formatCurrency({
										amount: calculateTotal,
										currency: currency as any,
									})}
								</span>
							</div>
							<div className="flex justify-between py-2 border-t gap-2 font-semibold">
								<span>Total ({currency})</span>
								<span className="underline underline-offset-4">
									{formatCurrency({
										amount: calculateTotal,
										currency: currency as any,
									})}
								</span>
							</div>
						</div>
					</div>

					<div>
						<Label>Note</Label>
						<Textarea
							name={fields.note.name}
							key={fields.note.key}
							defaultValue={data.note ?? undefined}
							placeholder="Add any additional information..."
							className="text-sm"
						/>
						<p className="text-sm text-red-500">{fields.note.errors}</p>
					</div>

					<div className="flex items-center justify-between mt-6">
						<Link
							className={buttonVariants({ variant: 'secondary' })}
							href="/dashboard/invoices"
						>
							Cancel
						</Link>

						<div>
							<SubmitButton text="Update Invoice" />
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
