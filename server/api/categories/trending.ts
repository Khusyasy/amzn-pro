export default defineEventHandler(async () => {
  const trendingCategories = await prisma.product.groupBy({
    by: 'categoryId',
    _sum: {
      boughtInLastMonth: true,
    },
    orderBy: {
      _sum: {
        boughtInLastMonth: 'desc',
      },
    },
    take: 6,
  })

  const categoryIds = trendingCategories.map(c => c.categoryId)
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  })

  return trendingCategories.map(tcat => ({
    id: tcat.categoryId,
    name: categories.find(cat => cat.id === tcat.categoryId)?.name,
    boughtInLastMonth: tcat._sum.boughtInLastMonth,
  }))
})
