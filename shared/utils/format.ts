const COUNTRY = 'id-ID'

const countFormatter = new Intl.NumberFormat(COUNTRY, {
  style: 'decimal',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})
export function formatCount(value: number | bigint | string | undefined | null): string {
  if (value === undefined || value === null) return '-'
  if (typeof value === 'string') value = Number(value)

  return countFormatter.format(value)
}
