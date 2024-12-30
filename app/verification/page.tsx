import { buttonVariants } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Verify() {
	return (
		<div className="min-h-screen w-full flex items-center justify-center">
			<div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(59,130,246,.7)_100%)]"></div>

			<Card className="w-[380px] px-5">
				<CardHeader className="text-center">
					<div className="mx-auto flex size-20 items-center justify-center rounded-full bg-blue-500 mb-4">
						<Mail className="size-12 text-blue-100" />
					</div>
					<CardTitle className="text-2xl ">Check your email</CardTitle>
					<CardDescription>
						We have sent a verification link to your email address.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mt-2 rounded-md bg-yellow-50 border-yellow-300 p-4">
						<div className="flex items-center">
							<AlertCircle className="size-5 text-yellow-400" />

							<p className="text-sm font-medium text-yellow-500 ml-3">
								Be sure to check your spam folder!
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Link
						href="/"
						className={buttonVariants({
							className: 'w-full',
							variant: 'outline',
						})}
					>
						<ArrowLeft className="size-4 mr-2" />
						Back to Homepage
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
