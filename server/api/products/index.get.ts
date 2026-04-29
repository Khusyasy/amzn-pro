export default defineEventHandler(async (event) => {
  const test = getRouterParam(event, 'test')
  console.log(test)

  const products = await prisma.product.findMany({
    take: 20,
  })

  return products
})
