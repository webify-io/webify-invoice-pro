import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingFormCreation() {
	return (
		<div className="flex flex-col space-y-3 justify-center h-full w-full">
			<Skeleton className="h-[75%] w-[65%] rounded-xl" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-[30%]" />
				<Skeleton className="h-4 w-[25%]" />
			</div>
		</div>
	);
}
