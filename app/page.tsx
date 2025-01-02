import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

export default function Home() {
	return (
		<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<Navbar />
			<Hero />
		</main>
	);
}
