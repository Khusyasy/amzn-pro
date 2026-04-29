export default defineEventHandler(async (event) => {
  const test = getRouterParam(event, 'test')
  console.log(test)

  const categories = await prisma.category.findMany({
    take: 20,
  })

  return categories
})
