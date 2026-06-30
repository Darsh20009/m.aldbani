import { connectMongoDB } from "./lib/mongodb";
import { User } from "./models/User";
import { Project } from "./models/Project";
import { Service } from "./models/Service";
import { Article } from "./models/Article";
import { CommunityPost } from "./models/CommunityPost";
import { logger } from "./lib/logger";

async function seed() {
  await connectMongoDB();

  // Admin user only — no demo clients
  const adminExists = await User.findOne({ email: "admin@m-aldbani.com" });
  if (!adminExists) {
    await User.create({
      name: "محمد الدباني",
      email: "admin@m-aldbani.com",
      password: "Admin@2024",
      role: "admin",
    });
    logger.info("Admin user created: admin@m-aldbani.com / Admin@2024");
  }

  // Projects
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        title: "Enterprise ERP Platform",
        titleAr: "منصة تخطيط موارد المؤسسة",
        description: "End-to-end ERP system handling 50,000+ daily transactions with real-time analytics.",
        descriptionAr: "نظام ERP متكامل يتعامل مع أكثر من 50,000 معاملة يومية مع تحليلات فورية.",
        category: "تطوير مواقع",
        technologies: ["React", "Node.js", "PostgreSQL", "Redis", "AWS"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        results: "تخفيض التكاليف التشغيلية بنسبة 40%، وتسريع التقارير 10 أضعاف",
        featured: true,
        order: 1,
      },
      {
        title: "AI-Powered Customer Intelligence",
        titleAr: "ذكاء العملاء بالذكاء الاصطناعي",
        description: "Machine learning platform that analyzes customer behavior and predicts churn with 94% accuracy.",
        descriptionAr: "منصة تعلم الآلة التي تحلل سلوك العملاء وتتنبأ بالانسحاب بدقة 94%.",
        category: "ذكاء اصطناعي",
        technologies: ["Python", "TensorFlow", "FastAPI", "MongoDB", "Docker"],
        image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800",
        results: "تقليص معدل الانسحاب 28%، وزيادة قيمة العميل على المدى الطويل",
        featured: true,
        order: 2,
      },
      {
        title: "Mobile Banking Super App",
        titleAr: "تطبيق البنك المتنقل الشامل",
        description: "Full-featured banking application serving 2M+ users with real-time transfers, investments, and insurance.",
        descriptionAr: "تطبيق بنكي متكامل يخدم أكثر من 2 مليون مستخدم مع تحويلات فورية واستثمارات وتأمين.",
        category: "تطبيقات",
        technologies: ["React Native", "Go", "Kafka", "PostgreSQL", "Kubernetes"],
        image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800",
        results: "تقييم 4.8 في متاجر التطبيقات، أكثر من 2 مليون مستخدم نشط",
        featured: true,
        order: 3,
      },
      {
        title: "Digital Transformation Roadmap",
        titleAr: "خارطة طريق التحول الرقمي",
        description: "Comprehensive digital transformation strategy for a regional bank covering people, process, and technology.",
        descriptionAr: "استراتيجية تحول رقمي شاملة لبنك إقليمي تشمل الأشخاص والعمليات والتكنولوجيا.",
        category: "استشارات",
        technologies: ["Strategy", "Change Management", "Agile", "OKRs"],
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        results: "تسليم قبل 3 سنوات من الجدول الزمني، توفير 60% من التكاليف",
        featured: false,
        order: 4,
      },
      {
        title: "Smart City Operations Platform",
        titleAr: "منصة عمليات المدينة الذكية",
        description: "IoT-connected operations dashboard integrating 500+ sensors and 30 city departments.",
        descriptionAr: "لوحة تحكم عمليات متصلة بإنترنت الأشياء، تربط 500+ مستشعر و30 دائرة حكومية.",
        category: "إدارة مشاريع",
        technologies: ["IoT", "Azure", "Power BI", "Python", "REST APIs"],
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800",
        results: "تحسين زمن الاستجابة الطارئة 30%، توفير 25% في استهلاك الطاقة",
        featured: false,
        order: 5,
      },
    ]);
  }

  // Services — بالريال السعودي
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        title: "Technical Consulting",
        titleAr: "استشارة تقنية",
        description: "Strategic technology advisory for executives. Architecture reviews, tech stack selection, and digital transformation roadmaps.",
        descriptionAr: "استشارة تقنية استراتيجية لكبار المديرين التنفيذيين. مراجعات المعمارية واختيار التقنيات وخرائط التحول الرقمي.",
        icon: "🧠",
        price: "يبدأ من 1,875 ر.س / جلسة",
        featured: true,
        order: 1,
      },
      {
        title: "Web Development",
        titleAr: "تطوير مواقع",
        description: "Full-stack web applications built with modern technologies. From MVPs to enterprise-scale platforms.",
        descriptionAr: "تطبيقات ويب متكاملة مبنية بأحدث التقنيات. من المنتجات الأولية إلى المنصات على مستوى المؤسسات.",
        icon: "💻",
        price: "يبدأ من 18,750 ر.س / مشروع",
        featured: true,
        order: 2,
      },
      {
        title: "AI & Machine Learning",
        titleAr: "الذكاء الاصطناعي والتعلم الآلي",
        description: "Custom AI solutions — predictive analytics, NLP, computer vision, and intelligent automation.",
        descriptionAr: "حلول ذكاء اصطناعي مخصصة — تحليلات تنبؤية، ومعالجة اللغة الطبيعية، ورؤية الحاسوب، وأتمتة ذكية.",
        icon: "🤖",
        price: "يبدأ من 37,500 ر.س / مشروع",
        featured: true,
        order: 3,
      },
      {
        title: "Business Analysis",
        titleAr: "تحليل أعمال",
        description: "Deep-dive business analysis to identify inefficiencies, map processes, and design optimized operational models.",
        descriptionAr: "تحليل أعمال معمق لتحديد أوجه القصور ورسم خرائط العمليات وتصميم نماذج تشغيلية محسّنة.",
        icon: "📊",
        price: "يبدأ من 11,250 ر.س / تعاقد",
        featured: false,
        order: 4,
      },
      {
        title: "Project Management",
        titleAr: "إدارة مشاريع",
        description: "End-to-end project delivery using Agile, PRINCE2, and hybrid methodologies. On time, on budget, every time.",
        descriptionAr: "تسليم مشاريع متكامل باستخدام منهجيات Agile وPRINCE2 والمختلطة. في الوقت المحدد وفي حدود الميزانية.",
        icon: "🎯",
        price: "يبدأ من 7,500 ر.س / شهر",
        featured: false,
        order: 5,
      },
    ]);
  }

  // Articles
  const articleCount = await Article.countDocuments();
  if (articleCount === 0) {
    const now = new Date();
    await Article.insertMany([
      {
        title: "The Future of AI in Arab Business",
        titleAr: "مستقبل الذكاء الاصطناعي في الأعمال العربية",
        slug: "future-ai-arab-business",
        excerpt: "How artificial intelligence is reshaping industries across the Gulf region and what leaders need to know.",
        excerptAr: "كيف يعيد الذكاء الاصطناعي تشكيل الصناعات في منطقة الخليج وما يحتاج القادة لمعرفته.",
        content: "الذكاء الاصطناعي لم يعد مفهوماً مستقبلياً للأعمال العربية — إنه يحدث الآن. في هذا المقال نستعرض أبرز التطبيقات وفرص الاستثمار في السوق السعودي والخليجي.",
        contentAr: "الذكاء الاصطناعي لم يعد مفهوماً مستقبلياً للأعمال العربية — إنه يحدث الآن. في هذا المقال نستعرض أبرز التطبيقات وفرص الاستثمار في السوق السعودي والخليجي.",
        category: "ذكاء اصطناعي",
        coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200",
        readTime: 8,
        published: true,
        publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Building Scalable Systems for 10M Users",
        titleAr: "بناء أنظمة قابلة للتوسع لـ 10 ملايين مستخدم",
        slug: "scalable-systems-10m-users",
        excerpt: "Architectural principles and engineering practices I've used to design systems that scale gracefully.",
        excerptAr: "المبادئ المعمارية وممارسات الهندسة التي استخدمتها لتصميم أنظمة تتوسع بسلاسة.",
        content: "قابلية التوسع ليست مجرد إضافة المزيد من الخوادم. إنها انضباط هندسي يبدأ من تصميم البنية الأساسية.",
        contentAr: "قابلية التوسع ليست مجرد إضافة المزيد من الخوادم. إنها انضباط هندسي يبدأ من تصميم البنية الأساسية.",
        category: "هندسة",
        coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200",
        readTime: 12,
        published: true,
        publishedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Digital Transformation: Beyond the Buzzword",
        titleAr: "التحول الرقمي: ما وراء الكلمات الرنانة",
        slug: "digital-transformation-beyond-buzzword",
        excerpt: "What real digital transformation looks like in practice, and why most initiatives fail within 18 months.",
        excerptAr: "كيف يبدو التحول الرقمي الحقيقي في الممارسة، ولماذا تفشل معظم المبادرات في غضون 18 شهراً.",
        content: "بعد قيادة أكثر من 40 برنامج تحول رقمي في السوق السعودي والخليجي، يمكنني إخبارك بحقيقة واحدة: النجاح يبدأ بالإنسان، ليس التقنية.",
        contentAr: "بعد قيادة أكثر من 40 برنامج تحول رقمي في السوق السعودي والخليجي، يمكنني إخبارك بحقيقة واحدة: النجاح يبدأ بالإنسان، ليس التقنية.",
        category: "استراتيجية",
        coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
        readTime: 10,
        published: true,
        publishedAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
      },
    ]);
  }

  // Community posts
  const postCount = await CommunityPost.countDocuments();
  if (postCount === 0) {
    await CommunityPost.insertMany([
      {
        title: "إطلاق منصة محمد الدباني الرسمية",
        content: "يسعدني الإعلان عن إطلاق منصتي الرسمية التي تجمع خدماتي الاستشارية ومشاريعي ومقالاتي في مكان واحد. المنصة مصممة خصيصاً لخدمة عملائي الكرام في المملكة العربية السعودية ودول الخليج.",
        type: "announcement",
        reactions: [],
        comments: [],
        seenBy: [],
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "رؤية 2030 وفرص التحول الرقمي",
        content: "رؤية المملكة 2030 تفتح آفاقاً واسعة للتحول الرقمي في جميع القطاعات. من الصحة إلى التعليم إلى المال والأعمال — الفرص هائلة لمن يعرف كيف يستثمرها. هل تريد أن تعرف من أين تبدأ؟",
        type: "update",
        reactions: [],
        comments: [],
        seenBy: [],
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "مقال جديد: مستقبل الذكاء الاصطناعي في الأعمال العربية",
        content: "نشرت مقالاً جديداً حول مستقبل الذكاء الاصطناعي في الأعمال العربية. المقال يستعرض أبرز التطبيقات الفعلية في السوق الخليجي والفرص المتاحة للمؤسسات والشركات الناشئة. اقرأه الآن في قسم المقالات.",
        type: "article",
        reactions: [],
        comments: [],
        seenBy: [],
        publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
    ]);
  }

  logger.info("Seed completed successfully");
  process.exit(0);
}

seed().catch((err) => {
  logger.error({ err }, "Seed failed");
  process.exit(1);
});
