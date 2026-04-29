const LOCALE = 'en-US'

const countFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'decimal',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})
export function formatCount(value: number | bigint | string | undefined | null): string {
  if (value === undefined || value === null) return '-'
  if (typeof value === 'string') value = Number(value)

  return countFormatter.format(value)
}

const compactFormatter = new Intl.NumberFormat(LOCALE, {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 1,
})
export function formatCompact(value: number | bigint | string | undefined | null): string {
  if (value === undefined || value === null) return '-'
  if (typeof value === 'string') value = Number(value)

  return compactFormatter.format(value)
}

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  maximumFractionDigits: 2,
  currency: 'USD',
})
export function formatCurrency(value: number | bigint | string | undefined | null): string {
  if (value === undefined || value === null) return '-'
  if (typeof value === 'string') value = Number(value)

  return currencyFormatter.format(value)
}
