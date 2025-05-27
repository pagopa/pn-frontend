export function extractRootTraceId(input: string | undefined | null): string | undefined {
  if (!input) {
    return undefined;
  }

  // Match "Root=..." and only return its value
  const match = input.match(/(?:^|;)Root=([^;]+)/);
  return match?.[1];
}
