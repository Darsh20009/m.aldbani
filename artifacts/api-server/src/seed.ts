import { connectMongoDB } from "./lib/mongodb";
import { User } from "./models/User";
import { Project } from "./models/Project";
import { Service } from "./models/Service";
import { Article } from "./models/Article";
import { Consultation } from "./models/Consultation";
import { Lead } from "./models/Lead";
import { CommunityPost } from "./models/CommunityPost";
import { logger } from "./lib/logger";

async function seed() {
  await connectMongoDB();

  // Admin user
  const adminExists = await User.findOne({ email: "admin@m-aldbani.com" });
  if (!adminExists) {
    await User.create({
      name: "Mohammed Al-Dabbani",
      email: "admin@m-aldbani.com",
      password: "Admin@2024",
      role: "admin",
    });
    logger.info("Admin user created: admin@m-aldbani.com / Admin@2024");
  }

  // Sample client
  const clientExists = await User.findOne({ email: "client@example.com" });
  if (!clientExists) {
    await User.create({
      name: "Ahmad Al-Rashidi",
      email: "client@example.com",
      password: "Client@2024",
      role: "client",
      phone: "+966501234567",
    });
  }

  // Projects
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        title: "Enterprise ERP Platform",
        titleAr: "منصة تخطيط موارد المؤسسة",
        description: "End-to-end ERP system for a Fortune 500 company handling 50,000+ daily transactions with real-time analytics.",
        descriptionAr: "نظام ERP متكامل لشركة ضمن قائمة Fortune 500 يتعامل مع أكثر من 50,000 معاملة يومية مع تحليلات فورية.",
        category: "تطوير مواقع",
        technologies: ["React", "Node.js", "PostgreSQL", "Redis", "AWS"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        results: "Reduced operational costs by 40%, improved reporting speed by 10x",
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
        results: "Reduced churn by 28%, increased LTV by $2.3M annually",
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
        results: "4.8-star App Store rating, 2M+ active users, $500M+ monthly volume",
        featured: true,
        order: 3,
      },
      {
        title: "Digital Transformation Roadmap",
        titleAr: "خارطة طريق التحول الرقمي",
        description: "Comprehensive digital transformation strategy for a regional bank, covering people, process, and technology.",
        descriptionAr: "استراتيجية تحول رقمي شاملة لبنك إقليمي تشمل الأشخاص والعمليات والتكنولوجيا.",
        category: "استشارات",
        technologies: ["Strategy", "Change Management", "Agile", "OKRs"],
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        results: "Delivered 3 years ahead of schedule, 60% cost reduction",
        featured: false,
        order: 4,
      },
      {
        title: "Smart City Operations Platform",
        titleAr: "منصة عمليات المدينة الذكية",
        description: "IoT-connected operations dashboard for a major gulf city, integrating 500+ sensors and 30 city departments.",
        descriptionAr: "لوحة تحكم عمليات متصلة بإنترنت الأشياء لمدينة خليجية كبرى، تربط 500+ مستشعر و30 دائرة حكومية.",
        category: "إدارة مشاريع",
        technologies: ["IoT", "Azure", "Power BI", "Python", "REST APIs"],
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800",
        results: "30% improvement in emergency response time, 25% energy savings",
        featured: false,
        order: 5,
      },
    ]);
  }

  // Services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      {
        title: "Technical Consulting",
        titleAr: "استشارة تقنية",
        description: "Strategic technology advisory for C-suite executives. Architecture reviews, tech stack selection, and digital transformation roadmaps.",
        descriptionAr: "استشارة تقنية استراتيجية لكبار المديرين التنفيذيين. مراجعات المعمارية واختيار التقنيات وخرائط التحول الرقمي.",
        icon: "Brain",
        price: "Starting at $500/session",
        featured: true,
        order: 1,
      },
      {
        title: "Web Development",
        titleAr: "تطوير مواقع",
        description: "Full-stack web applications built with modern technologies. From MVPs to enterprise-scale platforms.",
        descriptionAr: "تطبيقات ويب متكاملة مبنية بأحدث التقنيات. من المنتجات الأولية إلى المنصات على مستوى المؤسسات.",
        icon: "Code2",
        price: "Starting at $5,000/project",
        featured: true,
        order: 2,
      },
      {
        title: "AI & Machine Learning",
        titleAr: "الذكاء الاصطناعي والتعلم الآلي",
        description: "Custom AI solutions — predictive analytics, NLP, computer vision, and intelligent automation tailored to your business needs.",
        descriptionAr: "حلول ذكاء اصطناعي مخصصة — تحليلات تنبؤية، ومعالجة اللغة الطبيعية، ورؤية الحاسوب، وأتمتة ذكية.",
        icon: "Cpu",
        price: "Starting at $10,000/project",
        featured: true,
        order: 3,
      },
      {
        title: "Business Analysis",
        titleAr: "تحليل أعمال",
        description: "Deep-dive business analysis to identify inefficiencies, map processes, and design optimized operational models.",
        descriptionAr: "تحليل أعمال معمق لتحديد أوجه القصور ورسم خرائط العمليات وتصميم نماذج تشغيلية محسّنة.",
        icon: "BarChart3",
        price: "Starting at $3,000/engagement",
        featured: false,
        order: 4,
      },
      {
        title: "Project Management",
        titleAr: "إدارة مشاريع",
        description: "End-to-end project delivery using Agile, PRINCE2, and hybrid methodologies. On time, on budget, every time.",
        descriptionAr: "تسليم مشاريع متكامل باستخدام منهجيات Agile وPRINCE2 والمختلطة. في الوقت المحدد وفي حدود الميزانية.",
        icon: "Target",
        price: "Starting at $2,000/month",
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
        content: "Artificial intelligence is no longer a futuristic concept for Arab businesses — it is happening now...",
        contentAr: "لم يعد الذكاء الاصطناعي مفهوماً مستقبلياً للأعمال العربية — إنه يحدث الآن...",
        category: "AI",
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
        content: "Scalability is not just about adding more servers. It is a discipline...",
        contentAr: "قابلية التوسع ليست مجرد إضافة المزيد من الخوادم. إنها انضباط...",
        category: "Engineering",
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
        content: "After leading over 40 digital transformation programs, I can tell you one truth...",
        contentAr: "بعد قيادة أكثر من 40 برنامج تحول رقمي، يمكنني إخبارك بحقيقة واحدة...",
        category: "Strategy",
        coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200",
        readTime: 10,
        published: true,
        publishedAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
      },
    ]);
  }

  // Leads
  const leadCount = await Lead.countDocuments();
  if (leadCount === 0) {
    await Lead.insertMany([
      { name: "Khalid Al-Mutairi", email: "k.mutairi@company.sa", phone: "+966501111111", source: "LinkedIn", status: "new", value: 15000 },
      { name: "Sarah Johnson", email: "sarah@techcorp.ae", phone: "+971501234567", source: "referral", status: "in-contact", value: 25000 },
      { name: "Omar Abdullah", email: "omar@startup.com", phone: "+966507654321", source: "website", status: "client", value: 8000 },
      { name: "Fatima Al-Zahra", email: "fatima@bank.com", phone: "+966502222222", source: "conference", status: "new", value: 50000 },
    ]);
  }

  // Consultations
  const consultationCount = await Consultation.countDocuments();
  if (consultationCount === 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await Consultation.insertMany([
      {
        clientName: "Sarah Johnson",
        clientEmail: "sarah@techcorp.ae",
        clientPhone: "+971501234567",
        type: "Technical Consulting",
        date: tomorrow.toISOString().split("T")[0],
        time: "10:00",
        duration: 60,
        status: "confirmed",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        price: 500,
        paid: true,
      },
      {
        clientName: "Omar Abdullah",
        clientEmail: "omar@startup.com",
        clientPhone: "+966507654321",
        type: "Business Analysis",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time: "14:00",
        duration: 90,
        status: "completed",
        price: 750,
        paid: true,
        adminNotes: "Excellent session. Client interested in ongoing engagement.",
      },
    ]);
  }

  // Community posts
  const postCount = await CommunityPost.countDocuments();
  if (postCount === 0) {
    await CommunityPost.insertMany([
      {
        title: "Just launched a new AI integration for our client",
        content: "Excited to share that we've successfully deployed a custom AI model for one of our enterprise clients in the banking sector. The model predicts loan default risk with 96% accuracy — a massive improvement from their previous 78%. This is what happens when you combine domain expertise with the right technology stack.",
        type: "update",
        image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800",
        reactions: [],
        comments: [],
        seenBy: [],
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Speaking at GITEX Technology Week 2024",
        content: "I will be speaking at GITEX this year on the topic of 'AI-Driven Business Transformation in the GCC'. If you are attending, come join us at Hall 5, Day 2. I will share real case studies, mistakes we made, and the frameworks that actually work in our market.",
        type: "announcement",
        reactions: [],
        comments: [],
        seenBy: [],
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: "New article: The Future of AI in Arab Business",
        content: "My latest long-form piece is now live. I spent three weeks researching how AI is transforming industries across the Gulf — from banking and retail to healthcare and government. The numbers are staggering. Read the full article on the Articles page.",
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
