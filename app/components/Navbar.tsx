import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/logo.png';
import ShinyButton from '@/components/ui/shiny-button';

export function Navbar() {
	return (
		<div className="flex items-center justify-between py-5">
			<Link href="/" className="flex items-center gap-2">
				<Image
					src={Logo}
					alt="Logo"
					className="size-8 md:size-10 rounded-full"
				/>
				<h3 className="text-2xl md:text-3xl font-semibold">
					Invoice<span className="text-blue-600">Pro</span>
				</h3>
			</Link>

			<Link href="/login">
				<ShinyButton>Get Started</ShinyButton>
			</Link>
		</div>
	);
}
