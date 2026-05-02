export default defineEventHandler(async () => {
  const products = await prisma.product.findMany({
    take: 20,
  })

  return products
})
