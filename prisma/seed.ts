import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'Yasithma Products',
      tagline: 'Pure Ceylon Botanicals, Naturally Yours.',
      announcementText: 'Discover the Goodness of Pure Ceylon Botanicals',
      address: 'No. 48, Algama Road, Mahapitiya, Pothuhera, Sri Lanka',
      phone: '076 764 4654',
      whatsappNumber: '94767644654',
      email: 'info@yasithmaproducts.lk',
      standardDeliveryLkr: 350.0,
      freeDeliveryOverLkr: 3500.0,
      aboutStory:
        'Rooted in Pothuhera, Sri Lanka, Yasithma Products is dedicated to bringing authentic Ceylon herbal teas, finely milled botanical powders, and traditional natural ingredients from local gardens to modern homes. [Editable in Admin Dashboard]',
    },
  });

  const adminPassword = await bcrypt.hash(process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe123!', 12);
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_INITIAL_EMAIL || 'admin@yasithmaproducts.lk' },
    update: {},
    create: {
      email: process.env.ADMIN_INITIAL_EMAIL || 'admin@yasithmaproducts.lk',
      fullName: 'Yasithma Store Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const herbalTeas = await prisma.category.upsert({
    where: { slug: 'herbal-teas' },
    update: { imageUrl: '/images/products/blue-butterfly-flower-tea.jpeg' },
    create: {
      name: 'Herbal Teas',
      slug: 'herbal-teas',
      description: 'Vibrant whole-flower and aromatic Ceylon herbal infusions.',
      imageUrl: '/images/products/blue-butterfly-flower-tea.jpeg',
    },
  });

  const herbalPowders = await prisma.category.upsert({
    where: { slug: 'herbal-powders' },
    update: { imageUrl: '/images/products/heen-bovitiya-powder.jpeg' },
    create: {
      name: 'Herbal Powders',
      slug: 'herbal-powders',
      description: 'Finely milled Sri Lankan botanical leaves and traditional herbs.',
      imageUrl: '/images/products/heen-bovitiya-powder.jpeg',
    },
  });

  const botanicalSpices = await prisma.category.upsert({
    where: { slug: 'botanical-products' },
    update: { imageUrl: '/images/products/curry-leaves-powder.jpeg' },
    create: {
      name: 'Botanical & Culinary Products',
      slug: 'botanical-products',
      description: 'Pure culinary powders and whole Ceylon spices.',
      imageUrl: '/images/products/curry-leaves-powder.jpeg',
    },
  });

  const products = [
    {
      name: 'Blue Butterfly Flower Tea',
      sinhalaName: 'නිල් කටරොළු මල් තේ',
      botanicalName: 'Clitoria ternatea',
      slug: 'blue-butterfly-flower-tea',
      sku: 'YP-TEA-001',
      categoryId: herbalTeas.id,
      shortDescription: 'Whole dried Ceylon Blue Butterfly Pea flowers that steep into a vivid sapphire infusion.',
      detailedDescription:
        'Carefully harvested and gently dried whole Clitoria ternatea blossoms from Sri Lanka. Brews into a naturally vibrant blue herbal infusion that shifts to violet with a squeeze of fresh lime.',
      ingredients: '100% Dried Blue Butterfly Pea Flowers (Clitoria ternatea)',
      netWeight: '50g',
      priceLkr: 450.0,
      isSamplePrice: true,
      stockQuantity: 25,
      isFeatured: true,
      preparationUsage: 'Steep 4–5 dried flowers in 200ml of hot water (90°C) for 5 minutes. Enjoy warm or iced.',
      storageInstructions: 'Reseal pouch tightly after opening. Store in a cool, dry place away from direct sunlight.',
      images: ['/images/products/blue-butterfly-flower-tea.jpeg'],
    },
    {
      name: 'Heen Bovitiya Powder',
      sinhalaName: 'හීන් බෝවිටියා කුඩු',
      botanicalName: 'Osbeckia octandra',
      slug: 'heen-bovitiya-powder',
      sku: 'YP-PWD-001',
      categoryId: herbalPowders.id,
      shortDescription: 'Finely milled traditional Sri Lankan Heen Bovitiya leaf powder.',
      detailedDescription:
        'Prepared from selected Osbeckia octandra leaves, cherished in traditional Sri Lankan herbal practices and milled into a fine, easy-to-prepare botanical powder.',
      ingredients: '100% Heen Bovitiya Leaf Powder (Osbeckia octandra)',
      netWeight: '50g',
      priceLkr: 350.0,
      isSamplePrice: false,
      stockQuantity: 30,
      isFeatured: true,
      preparationUsage: 'Add 1 teaspoon to a cup of warm water or herbal porridge (Kola Kenda), stir well, and consume.',
      storageInstructions: 'Keep pouch tightly sealed in a cool, dry cupboard.',
      images: ['/images/products/heen-bovitiya-powder.jpeg'],
    },
    {
      name: 'Welpenala Powder',
      sinhalaName: 'වැල්පෙනෙල කුඩු',
      botanicalName: 'Cardiospermum halicacabum',
      slug: 'welpenala-powder',
      sku: 'YP-PWD-002',
      categoryId: herbalPowders.id,
      shortDescription: 'Pure Ceylon Welpenala botanical powder in a resealable freshness pouch.',
      detailedDescription:
        'Finely ground Cardiospermum halicacabum harvested from local Sri Lankan gardens and packed to preserve natural aroma and freshness.',
      ingredients: '100% Welpenala Powder (Cardiospermum halicacabum)',
      netWeight: '50g',
      priceLkr: 350.0,
      isSamplePrice: true,
      batchNumber: '120-20-08',
      stockQuantity: 20,
      isFeatured: true,
      preparationUsage: 'Mix 1 teaspoon with warm water or incorporate into traditional herbal beverages.',
      storageInstructions: 'Store in a dry, cool place away from moisture.',
      images: ['/images/products/welpenala-powder.jpeg'],
    },
    {
      name: 'Curry Leaves Powder',
      sinhalaName: 'කරපිංචා කොළ කුඩු',
      botanicalName: 'Murraya koenigii',
      slug: 'curry-leaves-powder',
      sku: 'YP-CUL-001',
      categoryId: botanicalSpices.id,
      shortDescription: 'Aromatic shade-dried Ceylon curry leaves milled into fine culinary & herbal powder.',
      detailedDescription:
        'Selected fragrant Ceylon curry leaves dried gently to retain their vibrant green color and essential oils, ideal for daily cooking or warm herbal drinks.',
      ingredients: '100% Ceylon Curry Leaves (Murraya koenigii)',
      netWeight: '50g',
      priceLkr: 300.0,
      isSamplePrice: true,
      batchNumber: '105-25-02',
      stockQuantity: 40,
      isFeatured: true,
      preparationUsage: 'Stir 1 teaspoon into warm water with a pinch of pepper, or add directly to curries and soups.',
      storageInstructions: 'Reseal zip pouch tightly after each use to preserve aroma.',
      images: ['/images/products/curry-leaves-powder.jpeg'],
    },
    {
      name: 'Hibiscus Flower Tea',
      sinhalaName: 'පොකුරු වද මල් තේ',
      botanicalName: 'Hibiscus rosa-sinensis',
      slug: 'hibiscus-flower-tea',
      sku: 'YP-TEA-002',
      categoryId: herbalTeas.id,
      shortDescription: 'Ruby-red Ceylon hibiscus petals offering a crisp, tart, refreshing herbal brew.',
      detailedDescription:
        'Whole dried red hibiscus calyxes and petals that steep into a rich crimson infusion with a naturally tangy, cranberry-like flavor profile.',
      ingredients: '100% Dried Hibiscus Flowers',
      netWeight: '50g',
      priceLkr: 420.0,
      isSamplePrice: true,
      stockQuantity: 22,
      isFeatured: true,
      preparationUsage: 'Steep 1 tablespoon of petals in boiling water for 5–7 minutes. Serve hot or chilled with honey.',
      storageInstructions: 'Store in a cool, dry place out of direct sunlight.',
      images: ['/images/products/hibiscus-flower-tea.jpeg'],
    },
    {
      name: 'Iramusu Tea',
      sinhalaName: 'ඉරමුසු තේ',
      botanicalName: 'Hemidesmus indicus',
      slug: 'iramusu-tea',
      sku: 'YP-TEA-003',
      categoryId: herbalTeas.id,
      shortDescription: 'Traditional aromatic Sri Lankan Iramusu herbal infusion with warm vanilla-like notes.',
      detailedDescription:
        'A beloved Sri Lankan cooling herbal infusion prepared from authentic Iramusu botanicals, prized for its soothing, naturally sweet aroma.',
      ingredients: '100% Ceylon Iramusu (Hemidesmus indicus)',
      netWeight: '50g',
      priceLkr: 380.0,
      isSamplePrice: true,
      stockQuantity: 18,
      isFeatured: false,
      preparationUsage: 'Steep 1 teaspoon in 200ml hot water for 5 minutes. Strain and enjoy.',
      storageInstructions: 'Keep tightly sealed in a cool, dry location.',
      images: ['/images/products/iramusu-tea.jpeg'],
    },
    {
      name: 'Yaki Naran Powder',
      sinhalaName: 'යකි නාරං කුඩු',
      botanicalName: 'Atalantia ceylanica',
      slug: 'yaki-naran-powder',
      sku: 'YP-PWD-003',
      categoryId: herbalPowders.id,
      shortDescription: 'Pure Ceylon Yaki Naran leaf powder prepared according to traditional methods.',
      detailedDescription:
        'Finely milled leaves of Atalantia ceylanica, carefully processed and sealed in a kraft barrier pouch to maintain natural purity.',
      ingredients: '100% Yaki Naran Powder (Atalantia ceylanica)',
      netWeight: '50g',
      priceLkr: 360.0,
      isSamplePrice: true,
      batchNumber: '102-25-02',
      stockQuantity: 15,
      isFeatured: false,
      preparationUsage: 'Dissolve 1 teaspoon in a cup of boiling water, allow to settle, and drink warm.',
      storageInstructions: 'Store in a cool, dry place away from heat and moisture.',
      images: ['/images/products/yaki-naran-powder.jpeg'],
    },
    {
      name: 'Whole Ceylon Black Pepper',
      sinhalaName: 'ගම්මිරිස්',
      botanicalName: 'Piper nigrum',
      slug: 'whole-ceylon-black-pepper',
      sku: 'YP-CUL-002',
      categoryId: botanicalSpices.id,
      shortDescription: 'Bold, sun-dried whole Ceylon black peppercorns packed in a 100g freshness pouch.',
      detailedDescription:
        'Hand-selected Sri Lankan black peppercorns known for their robust pungency and aromatic piperine content.',
      ingredients: '100% Whole Ceylon Black Peppercorns',
      netWeight: '100g',
      priceLkr: 320.0,
      isSamplePrice: false,
      stockQuantity: 35,
      isFeatured: false,
      preparationUsage: 'Grind fresh over dishes or crush lightly for herbal decoctions and teas.',
      storageInstructions: 'Keep tightly sealed in a cool, dry place.',
      images: ['/images/products/yasithma-product-collection.jpeg'],
    },
  ];

  for (const item of products) {
    const { images, ...productData } = item;
    await prisma.product.upsert({ // Upsert product with associated images
      where: { slug: productData.slug },
      update: {
        images: {
          deleteMany: {},
          create: images.map((url, idx) => ({
            url,
            altText: `${productData.name} - Yasithma Products`,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        },
      },
      create: {
        ...productData,
        images: {
          create: images.map((url, idx) => ({
            url,
            altText: `${productData.name} - Yasithma Products`,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
