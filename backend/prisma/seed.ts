import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking for existing SiteContent...');
  const existingContent = await prisma.siteContent.findUnique({
    where: { id: 1 },
  });

  if (!existingContent) {
    console.log('Seeding default SiteContent...');
    await prisma.siteContent.create({
      data: {
        hero: {
          logoImage: "/logo.jpg",
          heroTitle: "CRAVE",
          heroSubtitle: "Authentic Flavours, Unforgettable Moments",
          heroDescription: "Experience the finest Indian & Chinese cuisine at Crave — Gokak's premier family dining restaurant.",
          heroLocation: "GOKAK →",
          heroLocationLink: "https://www.google.com/maps?sca_esv=61c81e9d6a134ee7&rlz=1C1JJTC_enIN1106IN1107&output=search&q=spice+garden+gokak&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3j2nXl-YQ05KjnWz5SrU93H7yjmEhUi5AUSwdCoCuNwic2C_J_Rcmu3S7Rsfb8A-Hz00-ik_bO8c4MNkKc6tUmrCnhmBBrT29IjzuTXP2Ak-BeDcyqJz7v2k_Ej-hAjAQ0cyri10ggFh9PmGvCeGndjDicMMh169KjzYcYKe285f73kBkA&entry=mc&ved=1t:200715&ictx=111",
          heroAddress: "5R65+QQV, Yogikolla Rd, Janata Plot Sector 1, Gokak, Karnataka 591307",
          heroStatsHappyDiners: "15000+",
          heroStatsMenuItems: "60+",
          heroVideo: "/hero-video.mp4"
        },
        about: {
          aboutBadge: "Best Food",
          aboutTitle: "FOOD LOVER'S PARADISE",
          aboutButtonText: "VISIT NOW",
          aboutButtonLink: "/visit",
          aboutRightTitle: "Restaurant Cuisine",
          aboutRightSubtitle: "Where Every Meal Is a Celebration",
          aboutRightDesc1: "Crave is Gokak's premier family dining restaurant, serving authentic Indian and Chinese cuisine crafted with the freshest ingredients and traditional spices.",
          aboutRightDesc2: "Whether you're craving creamy butter chicken, sizzling tandoori kebabs, or flavorful vegetarian curries, our chefs bring passion to every dish. Perfect for family dinners, celebrations, and casual dining.",
          aboutImage: "/section-2/1.jpg"
        },
        online: {
          onlineTitle: "ONLINE RESERVATION",
          onlineDescription: "Crave is one of the most popular restaurants. Special menus made by our passionate chefs and quality that will impress you.",
          mediaType: "video",
          mediaUrl: "/video2.mp4"
        },
        call: {
          callPhone: "+91 9741800400",
          callTitle: "Craving Something Delicious?",
          callDescription: "Browse our full menu, add your favorites to the cart, and get hot food delivered right to your doorstep. Pay with Cash on Delivery or UPI."
        },
        event: {
          eventSubtitle: "EVENTS & CELEBRATIONS",
          eventTitle: "Something Special Awaits",
          eventDescription: "From live music nights to grand food festivals and private celebrations — discover what's happening at Crave."
        },
        promise: {
          promiseTitle: "OUR PROMISE",
          promiseSubtitle: "Why Dine at Crave?",
          promiseDescription: "Looking for the best family restaurant in Gokak? Crave has been the go-to destination for lovers of authentic Indian and Chinese cuisine. Our chefs use only the freshest ingredients and traditional spice blends to create dishes that burst with flavour — from creamy butter chicken and smoky tandoori kebabs to sizzling Hakka noodles and crispy Manchurian. Whether it's a cozy family dinner, a birthday celebration, or a casual outing with friends, our warm ambiance and attentive service make every visit special. We take pride in using authentic masalas and time-honoured recipes passed down through generations, ensuring every dish delivers rich aroma and unmatched taste. With convenient online ordering, easy table booking, and fast home delivery across Gokak, enjoying a restaurant-quality meal has never been easier. Visit Crave today and discover why thousands of happy diners keep coming back for more."
        },
        footer: {
          footerDescription: "Gokak's premier family dining restaurant. Authentic Indian & Chinese cuisine.",
          footerPhone: "097418 00400",
          footerAddress: "Jadhav Farm, Gokak, Karnataka",
          footerAddressLink: "https://maps.google.com",
          footerEmail: "info@crave.info",
          footerBackgroundType: "video",
          footerBackgroundMedia: "/footer.mp4",
          footerTextColor: "#FFFFFF",
          footerLinks: [
            { label: "Home", url: "/", isEnabled: true },
            { label: "Menu", url: "/menu", isEnabled: true },
            { label: "About", url: "/about", isEnabled: true },
            { label: "Gallery", url: "/gallery", isEnabled: true },
            { label: "Order Online", url: "/#order", isEnabled: true },
            { label: "Contact", url: "/contact", isEnabled: true }
          ],
          footerSocials: [
            { platform: "facebook", url: "https://facebook.com", isEnabled: true },
            { platform: "instagram", url: "https://instagram.com", isEnabled: true },
            { platform: "youtube", url: "https://youtube.com", isEnabled: true }
          ]
        }
      }
    });
  } else {
    console.log('SiteContent already exists, skipping.');
  }

  // Seed ChefSpecials
  const chefCount = await prisma.chefSpecial.count();
  if (chefCount === 0) {
    console.log('Seeding default Chef Specials...');
    await prisma.chefSpecial.createMany({
      data: [
        { title: "Butter Chicken", hoverText: "A creamy, tomato-based curry with tender chicken pieces.", image: "/section-3/butter-chicken.jpg" },
        { title: "Chicken Biryani", hoverText: "Aromatic basmati rice cooked with succulent chicken and spices.", image: "/section-3/chicken-biryani.jpg" },
        { title: "Paneer Tikka", hoverText: "Marinated cottage cheese cubes grilled to perfection.", image: "/section-3/panner-tikka.jpg" },
        { title: "Mutton Ghee Roast", hoverText: "Spicy and flavorful mutton roasted in rich ghee.", image: "/section-3/mutton.jpg" }
      ]
    });
  }

  // Seed Menu Categories
  const categoryCount = await prisma.contentMenuCategory.count();
  if (categoryCount === 0) {
    console.log('Seeding default ContentMenuCategories...');
    await prisma.contentMenuCategory.createMany({
      data: [
        { name: "All", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
        { name: "Main Course (Non-Veg)", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
        { name: "Soups", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
        { name: "Starters", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
        { name: "Chinese", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
        { name: "Main Course (Veg)", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
        { name: "Beverages & Salads", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
        { name: "Breads", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
        { name: "Biryani & Rice", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" },
        { name: "Desserts", isEnabled: true, image1: "/section-4/panner.jpg", image2: "/section-4/noodles.jpg", image3: "/section-4/prawns.jpg" }
      ]
    });
  }

  // Seed Testimonials
  const testCount = await prisma.testimonial.count();
  if (testCount === 0) {
    console.log('Seeding default Testimonials...');
    await prisma.testimonial.createMany({
      data: [
        { name: "Ravi Kumar", text: "The butter chicken here is simply outstanding! The ambiance is perfect for a family dinner. Highly recommend Crave to everyone in Gokak.", image: "/section-6/Ravi.jpg" },
        { name: "Priya Desai", text: "Authentic flavors and great service. The Chinese starters were crispy and delicious. A must-visit place for food lovers!", image: "/section-6/Priya.jpg" },
        { name: "Amit Patil", text: "Loved the Chicken Biryani. The aroma and taste were authentic. The staff is very polite and the place is very hygienic.", image: "/section-6/Amit.jpg" }
      ]
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
