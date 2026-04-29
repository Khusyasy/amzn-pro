export default defineEventHandler(async () => {
  const metas = await prisma.product.aggregate({
    _count: true,
  })

  return metas
})
