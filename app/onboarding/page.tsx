'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '../components/SubmitButton';
import { useActionState } from 'react';
import { onboardUser } from '../actions';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { onboardingSchema } from '../utils/zodSchemas';

export default function Onboarding() {
	const [lastResult, formAction] = useActionState(onboardUser, undefined);
	const [form, fields] = useForm({
		// Sync the result of last submission
		lastResult,

		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: onboardingSchema,
			});
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',
		shouldRevalidate: 'onInput',
	});

	return (
		<div className="min-h-screen w-screen flex items-center justify-center">
			<div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(59,130,246,.7)_100%)]"></div>

			<Card className="max-w-sm mx-auto">
				<CardHeader>
					<CardTitle className="text-xl">You are almost done!</CardTitle>
					<CardDescription>
						Enter your information to create an account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="grid gap-4"
						action={formAction}
						id={form.id}
						onSubmit={form.onSubmit}
						noValidate
					>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label>First Name</Label>
								<Input
									name={fields.firstName.name}
									key={fields.firstName.key}
									defaultValue={fields.firstName.initialValue}
									placeholder="John"
								/>
								<p className="text-red-500 text-sm">
									{fields.firstName.errors}
								</p>
							</div>
							<div className="flex flex-col gap-2">
								<Label>Last Name</Label>
								<Input
									name={fields.lastName.name}
									key={fields.lastName.key}
									defaultValue={fields.lastName.initialValue}
									placeholder="Doe"
								/>
								<p className="text-red-500 text-sm">{fields.lastName.errors}</p>
							</div>
						</div>

						{/* <div className="grid gap-4">
							<div className="flex flex-col gap-2">
								<Label>Phone Number</Label>
								<div className="grid grid-cols-[50px_1fr] gap-2">
									<Input placeholder="+27" />
									<Input placeholder="81 234 5678" />
								</div>
							</div>
						</div> */}

						{/* <div className="flex flex-col gap-1 w-fit">
							<div className="flex items-center gap-4">
								<Badge variant="secondary">Draft</Badge>
								<Input placeholder="test123" />
							</div>
						</div> */}

						<div className="grid gap-2">
							<Label>Address</Label>
							<Input
								name={fields.address.name}
								key={fields.address.key}
								defaultValue={fields.address.initialValue}
								placeholder="123 Main Street, Johannesburg, 2001"
							/>
							<p className="text-red-500 text-sm">{fields.address.errors}</p>
						</div>

						<SubmitButton text="Complete Onboarding" />
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
