export default defineEventHandler(async () => {
  const metas = await prisma.category.aggregate({
    _count: true,
  })

  return metas
})
