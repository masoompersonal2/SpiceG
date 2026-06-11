const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const chef = await prisma.chefSpecial.findUnique({ where: { id: 1 } });
    console.log("Current chef:", chef);
    
    // Update with id included
    const data = { ...chef, hoverText: chef.hoverText + " test" };
    console.log("Updating with data:", data);
    
    const updated = await prisma.chefSpecial.update({
      where: { id: 1 },
      data: data
    });
    console.log("Update successful:", updated);
  } catch (err) {
    console.error("Update failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
