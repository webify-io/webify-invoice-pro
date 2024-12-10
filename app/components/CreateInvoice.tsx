'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export function CreateInvoice() {
	const [selectedDate, setSelectedDate] = useState(new Date());

	return (
		<Card className="w-full max-w-4xl mx-auto">
			<CardContent className="p-6">
				<div className="flex flex-col gap-1 w-fit mb-6">
					<div className="flex items-center gap-4">
						<Badge variant="secondary">Draft</Badge>
						<Input placeholder="Test 123" />
					</div>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mb-6">
					<div>
						<Label>Invoice No.</Label>
						<div className="flex">
							<span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
								#
							</span>
							<Input className="rounded-l-none" placeholder="5" />
						</div>
					</div>

					<div>
						<Label>Currency</Label>
						<Select defaultValue="ZAR">
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
							<Input placeholder="Your Name" />
							<Input placeholder="Your Email" />
							<Input placeholder="Your Address" />
						</div>
					</div>

					<div>
						<Label>Invoice Recipient</Label>
						<div className="space-y-2">
							<Input placeholder="Client Name" />
							<Input placeholder="Client Email" />
							<Input placeholder="Client Address" />
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-6">
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
					</div>

					<div>
						<Label>Invoice Due</Label>
						<Select>
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
			</CardContent>
		</Card>
	);
}
