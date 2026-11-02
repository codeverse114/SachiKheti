import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SachiKheti database seed...');

  // 1. Create or update Superadmin
  const adminUsername = process.env.ADMIN_USERNAME || 'SachiKhetiAdmin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Sachi@Kheti123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.admin.upsert({
    where: { username: adminUsername },
    update: { passwordHash, role: 'SUPERADMIN' },
    create: {
      username: adminUsername,
      passwordHash,
      role: 'SUPERADMIN',
    },
  });
  console.log(`✅ Superadmin initialized: ${admin.username}`);

  // 2. Categories
  const categoriesData = [
    {
      name: 'Fresh Dairy',
      namePunjabi: 'ਤਾਜ਼ਾ ਡੇਅਰੀ ਉਤਪਾਦ',
      slug: 'dairy',
      description: '100% Pure Desi Cow Ghee, A2 Milk, Fresh Butter and Paneer direct from LFPC farms.',
      icon: 'Milk',
    },
    {
      name: 'Traditional Sweets',
      namePunjabi: 'ਦੇਸੀ ਘਿਓ ਦੇ ਮਿਠਾਈਆਂ',
      slug: 'sweets',
      description: 'Artisanal Punjabi sweets prepared with our authentic pure desi ghee and dry fruits.',
      icon: 'Cookie',
    },
    {
      name: 'Organic Manure & Bio-Fertilizers',
      namePunjabi: 'ਜੈਵਿਕ ਖਾਦ ਅਤੇ ਵਰਮੀਕੰਪੋਸਟ',
      slug: 'manure',
      description: 'High-nutrient vermicompost and cow dung organic fertilizer for superior soil fertility.',
      icon: 'Sprout',
    },
    {
      name: 'Farming Machinery & Tools',
      namePunjabi: 'ਖੇਤੀਬਾੜੀ ਮਸ਼ੀਨਰੀ ਅਤੇ ਸੰਦ',
      slug: 'machinery',
      description: 'Durable and heavy-duty agricultural tools, sprayers, and tractor attachments.',
      icon: 'Tractor',
    },
    {
      name: 'Farm Produce & Oils',
      namePunjabi: 'ਸ਼ੁੱਧ ਖੇਤੀ ਉਤਪਾਦ ਅਤੇ ਤੇਲ',
      slug: 'produce',
      description: 'Cold-pressed raw mustard oil, raw forest honey, and naturally grown grains.',
      icon: 'Wheat',
    },
  ];

  const categoriesMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoriesMap[cat.slug] = createdCat.id;
  }
  console.log('✅ Categories created.');

  // 3. Products
  const products = [
    {
      title: 'Pure Desi Cow Ghee (Bilona Method)',
      titlePunjabi: 'ਸ਼ੁੱਧ ਦੇਸੀ ਗਾਂ ਦਾ ਘਿਓ (ਬਿਲੋਣਾ ਢੰਗ)',
      description: 'Handcrafted traditional Vedic Bilona Ghee made from curd of grass-fed desi cows. Rich in aroma, golden granules, and natural goodness.',
      price: 1450,
      unit: '1 Litre Glass Jar',
      imageUrl: 'https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['dairy'],
      inStock: true,
      stockCount: 85,
      featured: true,
      specs: JSON.stringify({
        'Process': 'Vedic Bilona Churned',
        'Milk Source': 'Indigenous Grass-fed Cows',
        'Packaging': 'Food-grade Sealed Glass Jar',
        'Shelf Life': '12 Months'
      }),
    },
    {
      title: 'Fresh A2 Organic Raw Milk',
      titlePunjabi: 'ਤਾਜ਼ਾ ਏ2 ਜੈਵਿਕ ਕੱਚਾ ਦੁੱਧ',
      description: 'Freshly harvested whole raw A2 milk chilled within 1 hour of milking. Zero preservatives, unadulterated pure nutrition.',
      price: 85,
      unit: '1 Litre Pouch',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['dairy'],
      inStock: true,
      stockCount: 120,
      featured: true,
      specs: JSON.stringify({
        'Fat Content': '4.5% - 5.0%',
        'Protein': 'A2 Beta-Casein',
        'Delivery': 'Chilled Morning Delivery',
        'Packaging': 'Biodegradable Food Pouch'
      }),
    },
    {
      title: 'Authentic Desi Ghee Atta Pinni',
      titlePunjabi: 'ਦੇਸੀ ਘਿਓ ਵਾਲੀਆਂ ਆਟਾ ਪਿੰਨੀਆਂ',
      description: 'Classic Punjabi winter delicacy prepared with whole wheat flour, our pure desi ghee, organic jaggery, almonds, cashews, and edible gum (gond).',
      price: 680,
      unit: '1 kg Box',
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['sweets'],
      inStock: true,
      stockCount: 40,
      featured: true,
      specs: JSON.stringify({
        'Key Ingredients': 'Wheat flour, SachiKheti Desi Ghee, Gond, Dry Fruits, Jaggery',
        'No Added Refined Sugar': 'Yes (Gur Sweetened)',
        'Shelf Life': '45 Days'
      }),
    },
    {
      title: 'Desi Ghee Besan Ladoo',
      titlePunjabi: 'ਦੇਸੀ ਘਿਓ ਦੇ ਬੇਸਣ ਦੇ ਲੱਡੂ',
      description: 'Aromatic roasted gram flour simmered patiently in pure desi ghee, garnished with green cardamom and crunchy pistachios.',
      price: 590,
      unit: '1 kg Box',
      imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['sweets'],
      inStock: true,
      stockCount: 35,
      featured: false,
      specs: JSON.stringify({
        'Ingredients': 'Gram Flour (Besan), Desi Ghee, Cardamom, Dry Fruits',
        'Taste': 'Melt in mouth, rich ghee flavor'
      }),
    },
    {
      title: 'Premium Organic Vermicompost Manure',
      titlePunjabi: 'ਉੱਚ ਦਰਜੇ ਦੀ ਵਰਮੀਕੰਪੋਸਟ ਜੈਵਿਕ ਖਾਦ',
      description: '100% natural earthworm compost enriched with beneficial soil microbes, nitrogen, phosphorus, and potassium. Restores earthworm biodiversity.',
      price: 450,
      unit: '25 kg Bag',
      imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['manure'],
      inStock: true,
      stockCount: 150,
      featured: true,
      specs: JSON.stringify({
        'NPK Ratio': 'Natural Balanced Organic',
        'Moisture Content': '18% - 22%',
        'Suitable For': 'Wheat, Paddy, Vegetables, Fruit Orchards, Home Gardens'
      }),
    },
    {
      title: 'Neem-Coated Bio Organic Fertilizer',
      titlePunjabi: 'ਨੀਮ ਯੁਕਤ ਬਾਇਓ ਜੈਵਿਕ ਖਾਦ',
      description: 'Double fermented cow dung manure coated with organic neem cake to ward off root termites, nematodes, and soil pathogens while nourishing crops.',
      price: 520,
      unit: '25 kg Bag',
      imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['manure'],
      inStock: true,
      stockCount: 95,
      featured: false,
      specs: JSON.stringify({
        'Active Additives': 'Neem kernel cake extract',
        'Target Protection': 'Termites, White grubs, Root fungi'
      }),
    },
    {
      title: 'Heavy Duty Tractor Rotavator (7 Feet)',
      titlePunjabi: 'ਭਾਰੀ ਡਿਊਟੀ ਟਰੈਕਟਰ ਰੋਟਾਵੇਟਰ (7 ਫੁੱਟ)',
      description: 'Multi-speed gear drive tractor rotary tiller equipped with boron steel blades for finest soil pulverization and seedbed preparation.',
      price: 115000,
      unit: '1 Complete Unit',
      imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['machinery'],
      inStock: true,
      stockCount: 6,
      featured: true,
      specs: JSON.stringify({
        'Compatible Tractor': '45 HP - 60 HP',
        'Blades': 'L-type & C-type Boron Steel (48 blades)',
        'Warranty': '1 Year LFPC Manufacturer Guarantee',
        'Subsidy Eligible': 'Approved under Government Farm Mechanization'
      }),
    },
    {
      title: 'Automatic Battery Operated Crop Sprayer (16L)',
      titlePunjabi: 'ਬੈਟਰੀ ਵਾਲਾ ਆਟੋਮੈਟਿਕ ਸਪਰੇਅ ਪੰਪ (16 ਲੀਟਰ)',
      description: 'Ergonomic high-pressure backpack sprayer with 12V 12Ah rechargeable battery, brass telescopic lance, and 4 interchangeable spray nozzles.',
      price: 2850,
      unit: '1 Set with Charger',
      imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['machinery'],
      inStock: true,
      stockCount: 45,
      featured: false,
      specs: JSON.stringify({
        'Tank Capacity': '16 Litres',
        'Battery Run Time': '6 to 8 hours per full charge',
        'Material': 'High-density Polypropylene (Corrosion resistant)'
      }),
    },
    {
      title: 'Cold-Pressed Raw Kachi Ghani Mustard Oil',
      titlePunjabi: 'ਕੱਚੀ ਘਾਣੀ ਦਾ ਸ਼ੁੱਧ ਸਰ੍ਹੋਂ ਦਾ ਤੇਲ',
      description: 'Traditional wood-pressed (Kolhu) mustard oil extracted from farm-grown black mustard seeds without chemical heating. High pungency and pure golden aroma.',
      price: 210,
      unit: '1 Litre Bottle',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['produce'],
      inStock: true,
      stockCount: 110,
      featured: true,
      specs: JSON.stringify({
        'Extraction': 'Wood Cold-Pressed (Lakdi Ghani)',
        'Purity': '100% Unrefined & Unfiltered',
        'Uses': 'Cooking, Pickling, Ayurvedic Massage'
      }),
    },
    {
      title: 'Wild Forest Raw Organic Honey',
      titlePunjabi: 'ਜੰਗਲੀ ਕੁਦਰਤੀ ਸ਼ੁੱਧ ਸ਼ਹਿਦ',
      description: 'Unprocessed, unpasteurized honey harvested responsibly from mustard and forest flora. Rich in natural bee pollen, enzymes, and antioxidants.',
      price: 490,
      unit: '500g Glass Bottle',
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['produce'],
      inStock: true,
      stockCount: 60,
      featured: false,
      specs: JSON.stringify({
        'Color': 'Warm Amber',
        'Sweetener': 'Zero added glucose/sugar syrup',
        'Origin': 'LFPC Apiary Network'
      }),
    },
  ];

  for (const prod of products) {
    const existing = await prisma.product.findFirst({
      where: { title: prod.title },
    });
    if (!existing) {
      await prisma.product.create({ data: prod });
    }
  }
  console.log('✅ Products seeded successfully.');

  // 4. Banners
  await prisma.banner.upsert({
    where: { id: 'welcome-banner-1' },
    update: {
      title: '🌾 SachiKheti Festive Harvest Offer',
      message: 'Get 10% off on Pure Desi Ghee & Pinnis using code SACHI10! WhatsApp Direct Delivery available.',
      isActive: true,
    },
    create: {
      id: 'welcome-banner-1',
      title: '🌾 SachiKheti Festive Harvest Offer',
      message: 'Get 10% off on Pure Desi Ghee & Pinnis using code SACHI10! WhatsApp Direct Delivery available.',
      isActive: true,
    },
  });
  console.log('✅ Banners created.');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
