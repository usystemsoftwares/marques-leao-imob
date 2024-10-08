async function checkFetchStatus(
  response: Response,
  endpoint: string
): Promise<void> {
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}: ${response}`);
  }
}

export default checkFetchStatus;
