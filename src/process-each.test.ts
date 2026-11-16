import { describe, expect, it } from 'vitest'
import { processEach } from './process-each'

describe('processEach', () => {
  it('returns no failures for empty input', async () => {
    expect(await processEach([], () => Promise.resolve())).toEqual([])
  })

  it('calls the handler once per item in order and returns no failures', async () => {
    const seen: number[] = []
    const failures = await processEach([1, 2, 3], (item) => {
      seen.push(item)
      return Promise.resolve()
    })
    expect(seen).toEqual([1, 2, 3])
    expect(failures).toEqual([])
  })

  it('records a failing item and still processes the later items', async () => {
    const seen: number[] = []
    const error = new Error('boom')
    const failures = await processEach([1, 2, 3], (item) => {
      seen.push(item)
      return item === 2 ? Promise.reject(error) : Promise.resolve()
    })
    expect(seen).toEqual([1, 2, 3])
    expect(failures).toEqual([{ item: 2, error }])
  })

  it('returns every failure in input order', async () => {
    const first = new Error('first')
    const third = new Error('third')
    const failures = await processEach([1, 2, 3], (item) =>
      item === 2
        ? Promise.resolve()
        : Promise.reject(item === 1 ? first : third)
    )
    expect(failures).toEqual([
      { item: 1, error: first },
      { item: 3, error: third },
    ])
  })

  it('records a handler that throws synchronously instead of rejecting', async () => {
    const error = new Error('sync')
    const failures = await processEach([1], () => {
      throw error
    })
    expect(failures).toEqual([{ item: 1, error }])
  })

  it('returns a non-Error rejection value unchanged', async () => {
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    const failures = await processEach(['a'], () => Promise.reject('plain'))
    expect(failures).toEqual([{ item: 'a', error: 'plain' }])
  })
})
