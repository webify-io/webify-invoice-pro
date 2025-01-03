import Link from 'next/link';

export function Footer() {
	return (
		<footer className="flex flex-col md:flex-row mx-auto max-w-5xl px-5 gap-2 items-center justify-center md:justify-between mt-16 mb-6 text-xs md:text-sm text-muted-foreground">
			<p>InvoicePro &copy; {new Date().getFullYear()}.</p>
			<p className="text-center">
				Created by
				<Link
					href="https://www.webify.org.za/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span className="font-semibold text-blue-600 hover:text-blue-400">
						{' '}
						Webify{' '}
					</span>
				</Link>
				with Next.js, Mailtrap and Prisma
			</p>
		</footer>
	);
}
