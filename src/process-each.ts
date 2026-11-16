/** An item whose handler threw, with the thrown value. */
export interface ItemFailure<T> {
  item: T
  error: unknown
}

/**
 * Runs `handler` sequentially for every item, continuing after failures.
 * Never throws; a thrown or rejected value is recorded instead.
 * @param items - Items to process
 * @param handler - Async work for one item
 * @returns The failures, in input order (empty when every item succeeded)
 */
export async function processEach<T>(
  items: T[],
  handler: (item: T) => Promise<void>
): Promise<ItemFailure<T>[]> {
  const failures: ItemFailure<T>[] = []
  for (const item of items) {
    try {
      await handler(item)
    } catch (error) {
      failures.push({ item, error })
    }
  }
  return failures
}
