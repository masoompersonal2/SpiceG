const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const menu = await prisma.menuItem.findMany({ take: 3 });
  console.log("Menu Items:", menu.map(m => ({ id: m.id, name: m.name, image: m.image })));
  
  const site = await prisma.siteContent.findUnique({ where: { id: 1 } });
  console.log("Hero Video:", site?.hero?.heroVideo);
  console.log("About Image:", site?.about?.aboutImage);
}
main().finally(() => prisma.$disconnect());
