import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth, signIn } from '../utils/auth';
import { SubmitButton } from '../components/SubmitButton';
import { redirect } from 'next/navigation';

export default async function Login() {
	const session = await auth();

	if (session?.user) {
		redirect('/dashboard');
	}

	return (
		<>
			<div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(59,130,246,.7)_100%)]"></div>

			<div className="flex h-screen w-full items-center justify-center px-4">
				<Card className="max-w-sm">
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription>
							Enter your email below to login into your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							action={async (formData) => {
								'use server';
								await signIn('nodemailer', formData);
							}}
							className="flex flex-col gap-y-4"
						>
							<div className="flex flex-col gap-y-2">
								<Label>Email</Label>
								<Input
									name="email"
									type="email"
									required
									placeholder="hello@gmail.com"
								/>
							</div>
							<SubmitButton text="Submit" />
						</form>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
