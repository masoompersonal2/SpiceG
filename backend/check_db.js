const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const chef = await prisma.chefSpecial.findMany();
    console.log("ChefSpecials:", JSON.stringify(chef, null, 2));

    const site = await prisma.siteContent.findUnique({ where: { id: 1 } });
    console.log("SiteContent About:", site.about);
    
    const menu = await prisma.contentMenuCategory.findMany();
    console.log("Categories:", JSON.stringify(menu, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
check();
