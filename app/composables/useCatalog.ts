export function useCatalog() {
  const state = useState<{
    page?: number
    size?: number
    q: string
    c: number
  }>('catalog', () => ({
    q: '',
    c: -1,
  }))

  return state
}
