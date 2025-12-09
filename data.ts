import { DepartmentContent, DepartmentType } from './types';

export const departments: DepartmentContent[] = [
  {
    id: DepartmentType.HARDWARE,
    title: "Hardware Department",
    subtitle: "The tools you need, the service you deserve.",
    iconName: "wrench",
    colorClass: "bg-slate-700",
    image: "https://picsum.photos/1200/800?random=1",
    description: [
      "Everyday tools & essentials for homeowners and pros.",
      "Comprehensive Fasteners, electrical, and plumbing sections.",
      "Premium Paints, adhesives, and masonry supplies.",
      "Specialty repair parts you won’t find at big box stores.",
      "Veteran-level customer service (zero corporate robots)."
    ],
    fullDescription: "Since our founding, the Hardware Department has been the backbone of Main Hardware. We don't just sell tools; we solve problems. Whether you're a contractor needing a specific grade of bolt or a homeowner trying to fix a leaky faucet on a Sunday, our aisles are stocked with the essentials and the hard-to-find specialty items. Our team brings decades of hands-on experience to help you find exactly what you need.",
    categories: [
      { id: 'h1', name: 'Power Tools', image: 'https://picsum.photos/400/300?random=101' },
      { id: 'h2', name: 'Plumbing & Faucets', image: 'https://picsum.photos/400/300?random=102' },
      { id: 'h3', name: 'Electrical Supplies', image: 'https://picsum.photos/400/300?random=103' },
      { id: 'h4', name: 'Paint & Sundries', image: 'https://picsum.photos/400/300?random=104' },
      { id: 'h5', name: 'Fasteners & Hardware', image: 'https://picsum.photos/400/300?random=105' },
      { id: 'h6', name: 'Lawn & Garden', image: 'https://picsum.photos/400/300?random=106' }
    ],
    services: [
      { title: "Key Cutting", description: "Precision duplication for house and padlock keys.", iconName: "key" },
      { title: "Paint Matching", description: "Computerized color matching to get that perfect shade.", iconName: "palette" },
      { title: "Screen Repair", description: "Window and door screen repair services available.", iconName: "grid" },
      { title: "Pipe Threading", description: "Custom length pipe cutting and threading.", iconName: "settings" }
    ]
  },
  {
    id: DepartmentType.CHRISTMAS,
    title: "Christmasland",
    subtitle: "Seasonal All-Year Round Magic",
    iconName: "gift",
    colorClass: "bg-red-600",
    image: "https://images.unsplash.com/photo-1512474932049-782e02684712?q=80&w=2000&auto=format&fit=crop",
    description: [
      "Premium Christmas décor available all year long.",
      "Massive selection of indoor & outdoor lights.",
      "Lifelike Trees, wreaths, and festive inflatables.",
      "Collectible Seasonal villages and displays.",
      "Complete Gift accessories, ribbon, and wrapping station."
    ],
    fullDescription: "Step into Christmasland, where the holiday spirit never sleeps! We are one of the few places where you can walk among twinkling lights and decorated trees in the middle of July. From heirloom-quality ornaments to commercial-grade outdoor displays, we make your holidays brighter. Our team travels to trade shows early in the year to bring the latest trends and classic favorites back to Wilkes-Barre.",
    categories: [
      { id: 'c1', name: 'Artificial Trees', image: 'https://picsum.photos/400/300?random=201' },
      { id: 'c2', name: 'Indoor/Outdoor Lights', image: 'https://picsum.photos/400/300?random=202' },
      { id: 'c3', name: 'Ornaments & Trim', image: 'https://picsum.photos/400/300?random=203' },
      { id: 'c4', name: 'Holiday Villages', image: 'https://picsum.photos/400/300?random=204' },
      { id: 'c5', name: 'Inflatables', image: 'https://picsum.photos/400/300?random=205' },
      { id: 'c6', name: 'Wreaths & Garlands', image: 'https://picsum.photos/400/300?random=206' }
    ],
    services: [
      { title: "Custom Bow Making", description: "Hand-tied bows for wreaths and gifts.", iconName: "gift" },
      { title: "Design Consultation", description: "Advice on lighting displays and tree decorating.", iconName: "lightbulb" },
      { title: "Commercial Displays", description: "Large scale decor solutions for businesses.", iconName: "briefcase" }
    ]
  },
  {
    id: DepartmentType.POOL,
    title: "Pool Discount Supply",
    subtitle: "Crystal clear water starts here.",
    iconName: "anchor",
    colorClass: "bg-blue-500",
    image: "https://picsum.photos/1200/800?random=3",
    description: [
      "High-quality Chemicals for any pool type.",
      "Replacement Filters, Pumps, and specialized Parts.",
      "Comprehensive Closing kits & Opening kits.",
      "Professional On-site pool equipment testing.",
      "Reliable Pool maintenance scheduling."
    ],
    highlight: "Flexible Layaway plans available for pool orders. Secure your summer fun today!",
    fullDescription: "Don't let green water ruin your summer. Main Hardware & Pool Discount Supply is your authority on pool care. We stock the potent, professional-grade chemicals that actually work, not the watered-down versions found elsewhere. Our computerized water testing lab provides you with a precise recipe for a crystal-clear pool. Plus, with our Layaway program, you can lock in prices on pumps, filters, and large orders early in the season.",
    categories: [
      { id: 'p1', name: 'Pool Chemicals', image: 'https://picsum.photos/400/300?random=301' },
      { id: 'p2', name: 'Pumps & Filters', image: 'https://picsum.photos/400/300?random=302' },
      { id: 'p3', name: 'Maintenance Tools', image: 'https://picsum.photos/400/300?random=303' },
      { id: 'p4', name: 'Liners & Covers', image: 'https://picsum.photos/400/300?random=304' },
      { id: 'p5', name: 'Toys & Floats', image: 'https://picsum.photos/400/300?random=305' },
      { id: 'p6', name: 'Spa Supplies', image: 'https://picsum.photos/400/300?random=306' }
    ],
    services: [
      { title: "Free Water Testing", description: "Computerized analysis with printed treatment instructions.", iconName: "flask" },
      { title: "Layaway Plans", description: "Flexible payment options for equipment and bulk orders.", iconName: "credit-card" },
      { title: "Equipment Repair", description: "In-shop repair for pumps and cleaners.", iconName: "tool" },
      { title: "Maintenance Scheduling", description: "Connect with pros for opening/closing services.", iconName: "calendar" }
    ]
  },
  {
    id: DepartmentType.COMMERCIAL,
    title: "Commercial Supply Division",
    subtitle: "B2B Solutions for Local Business",
    iconName: "factory",
    colorClass: "bg-orange-600",
    image: "https://picsum.photos/1200/800?random=4",
    description: [
      "Bulk pool chemicals for facilities.",
      "Bulk hardware orders with volume pricing.",
      "Restaurant & retail facility maintenance supplies.",
      "Commercial Christmas décor programs for businesses.",
      "Direct B2B ordering, invoicing, and delivery services."
    ],
    fullDescription: "We understand that local businesses need a partner they can rely on. Our Commercial Supply Division supports hotels, restaurants, apartment complexes, and municipalities with bulk pricing and reliable delivery. Whether you need a pallet of ice melt in winter or drums of chlorine in summer, we have the logistics to keep your facility running smoothly.",
    categories: [
      { id: 'com1', name: 'Bulk Chemicals', image: 'https://picsum.photos/400/300?random=401' },
      { id: 'com2', name: 'Janitorial Supplies', image: 'https://picsum.photos/400/300?random=402' },
      { id: 'com3', name: 'Safety Equipment', image: 'https://picsum.photos/400/300?random=403' },
      { id: 'com4', name: 'Facility Maintenance', image: 'https://picsum.photos/400/300?random=404' },
      { id: 'com5', name: 'Paint & Applicators', image: 'https://picsum.photos/400/300?random=405' },
      { id: 'com6', name: 'Commercial Decor', image: 'https://picsum.photos/400/300?random=406' }
    ],
    services: [
      { title: "Direct Delivery", description: "Job site or facility delivery available.", iconName: "truck" },
      { title: "Volume Pricing", description: "Tiered discounts for bulk purchases.", iconName: "percent" },
      { title: "Account Management", description: "Dedicated support for commercial accounts.", iconName: "user-check" },
      { title: "Net-30 Terms", description: "Available for qualified local businesses.", iconName: "file-text" }
    ]
  }
];
