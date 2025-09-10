export async function microYield(): Promise<void> {
	// Yield control to allow GC and UI to breathe
	await new Promise((resolve) => setTimeout(resolve, 0));
}


