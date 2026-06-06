import prisma from './src/lib/prisma';

async function main() {
  const categories = [
    { name: 'Homeopathy' },
    { name: 'Ayurveda' },
    { name: 'Allopathy' },
    { name: 'Nutrition' },
    { name: 'General Health' },
  ]

  console.log('Seeding categories...')
  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    })
  }
  console.log('Categories seeded!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // lib-sql adapter doesn't actually need $disconnect in the same way, but it's safe to call.
    await prisma.$disconnect()
  })
