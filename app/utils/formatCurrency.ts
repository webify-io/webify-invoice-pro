// Function to store currency
interface iAppProps {
	amount: number;
	currency?: 'ZAR' | 'USD' | 'EUR';
}

export function formatCurrency({ amount, currency = 'ZAR' }: iAppProps) {
	let formattedAmount = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
	}).format(amount);

	// Replace 'ZAR' with 'R' and ensure no trailing space
	if (currency === 'ZAR') {
		formattedAmount = formattedAmount.replace(/\s?ZAR\s?/g, 'R');
	}

	return formattedAmount;
}
