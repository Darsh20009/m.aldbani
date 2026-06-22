import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useListArticles } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Articles() {
  const { t, language } = useLanguage();
  const { data: articles = [], isLoading } = useListArticles();

  return (
    <RootLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold font-heading mb-4">
              {t("Insights & Articles", "الرؤى والمقالات")}
            </h1>
            <p className="text-white/60 text-lg">
              {t("Thoughts on technology, leadership, and the future of digital business.", "أفكار حول التكنولوجيا والقيادة ومستقبل الأعمال الرقمية.")}
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-8 max-w-4xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-xl h-48 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto">
              {articles.map((article, i) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/articles/${article.slug}`}>
                    <div className="glass-card rounded-xl overflow-hidden group cursor-pointer flex flex-col md:flex-row">
                      {article.coverImage && (
                        <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden">
                          <img 
                            src={article.coverImage} 
                            alt={language === "ar" ? article.titleAr : article.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-8 flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-4 text-sm text-primary font-mono mb-3">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span>{article.readTime} {t("min read", "دقائق قراءة")}</span>
                        </div>
                        <h3 className="text-2xl font-bold font-heading mb-3 group-hover:text-primary transition-colors">
                          {language === "ar" ? article.titleAr : article.title}
                        </h3>
                        <p className="text-white/60 line-clamp-2">
                          {language === "ar" ? article.excerptAr : article.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </RootLayout>
  );
}
