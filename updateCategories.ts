import prisma from './src/lib/prisma';

async function main() {
  const newCategories = [
    { name: 'Observation' },
    { name: 'Case Studies' },
    { name: 'Materia Medica' },
    { name: 'Remedies' },
    { name: 'Symptoms' },
  ];

  console.log('Deleting old categories...');
  await prisma.category.deleteMany({});

  console.log('Seeding new categories...');
  for (const c of newCategories) {
    await prisma.category.create({
      data: c,
    });
  }
  console.log('Categories updated!');
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
