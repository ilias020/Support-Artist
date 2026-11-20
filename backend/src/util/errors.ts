export function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

export function mysqlErrno(error: unknown): number | undefined {
	if (typeof error === "object" && error !== null && "errno" in error && typeof error.errno === "number") {
		return error.errno;
	}
	return undefined;
}
