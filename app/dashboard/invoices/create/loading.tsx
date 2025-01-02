import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingFormCreation() {
	return (
		<div className="flex flex-col space-y-3 justify-center h-full w-full">
			<Skeleton className="h-[125px] w-[250px] md:h-[75%] md:w-[65%] rounded-xl" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-[250px] md:w-[30%]" />
				<Skeleton className="h-4 w-[200px] md:w-[25%]" />
			</div>
		</div>
	);
}
