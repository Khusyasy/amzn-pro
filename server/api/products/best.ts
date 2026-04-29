export default defineEventHandler(async () => {
  const best = await prisma.product.findFirst({
    where: {
      isBestSeller: true,
    },
  })

  return best
})
