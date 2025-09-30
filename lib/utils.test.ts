import { formatDuration } from './utils'

describe('formatDuration', () => {
  it('formats zero', () => {
    expect(formatDuration(0)).toBe('00:00:00')
  })

  it('formats seconds only', () => {
    expect(formatDuration(9)).toBe('00:00:09')
  })

  it('formats minutes and seconds', () => {
    expect(formatDuration(75)).toBe('00:01:15')
  })

  it('formats hours, minutes, seconds', () => {
    expect(formatDuration(3661)).toBe('01:01:01')
  })
})

