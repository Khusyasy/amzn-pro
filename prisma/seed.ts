import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import z from 'zod'
import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const DATA_DIR = path.resolve('prisma/data')
const PRODUCTS_CSV = path.join(DATA_DIR, 'amazon_products.csv')
const CATEGORIES_CSV = path.join(DATA_DIR, 'amazon_categories.csv')

const RawCategorySchema = z.object({
  id: z.coerce.number().int(),
  category_name: z.string().min(1),
})
type RawCategoryType = z.infer<typeof RawCategorySchema>

async function seedCategories(): Promise<void> {
  const start = performance.now()
  const count = await prisma.category.count()
  if (count > 0) {
    console.log(`Categories already seeded (${count} rows)`)
    return
  }

  const parser = fs
    .createReadStream(CATEGORIES_CSV)
    .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))

  const rows: RawCategoryType[] = []
  for await (const record of parser) {
    const data = RawCategorySchema.parse(record)
    rows.push(data)
  }

  await prisma.category.createMany({
    data: rows.map((r) => {
      const { category_name, ...rr } = r
      return { ...rr, name: category_name }
    }),
    skipDuplicates: true,
  })

  const end = performance.now()
  const duration = ((end - start) / 1000).toFixed(2)
  console.log(`Categories seeded (${rows.length} rows) in ${duration}s`)
}

async function seedProducts(): Promise<void> {
  const start = performance.now()
  const count = await prisma.product.count()
  if (count > 0) {
    console.log(`Products already seeded (${count} rows)`)
    return
  }

  const totalInserted = await prisma.$executeRawUnsafe(`
  COPY "Product"(asin, title, "imgUrl", "productUrl", stars, reviews, price, "listPrice", "categoryId", "isBestSeller", "boughtInLastMonth")
  FROM '${PRODUCTS_CSV}'
  DELIMITER ','
  CSV HEADER;
`)

  const end = performance.now()
  const duration = ((end - start) / 1000).toFixed(2)
  console.log(`Products seeded (${totalInserted} rows) in ${duration}s`)
}

async function main() {
  await seedCategories()
  await seedProducts()

  const result = await prisma.$queryRaw`SELECT pg_size_pretty(pg_database_size(current_database())) as size` as Record<string, string>[]
  console.log(`DB size: ${result[0].size}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
