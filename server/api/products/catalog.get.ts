const paramsSchema = z.object({
  page: z.coerce.number().default(1),
  size: z.coerce.number().default(10),
  q: z.string().optional(), // text query
  c: z.coerce.number().optional(), // category id
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedQuery(event, paramsSchema.parse)

  const products = await prisma.product.findMany({
    where: {
      title: {
        search: params.q ? `${params.q}:*` : undefined,
      },
      categoryId: params.c || undefined,
    },
    include: {
      category: true,
    },
    take: params.size,
    skip: params.size * (params.page - 1),
  })

  return products
})
