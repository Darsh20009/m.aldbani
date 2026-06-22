import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useGetArticle, getGetArticleQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  
  const { data: article, isLoading } = useGetArticle(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetArticleQueryKey(slug)
    }
  });

  if (isLoading) {
    return (
      <RootLayout>
        <div className="container mx-auto px-4 py-24 max-w-3xl animate-pulse">
          <div className="h-8 bg-primary/10 rounded w-1/4 mb-6"></div>
          <div className="h-16 bg-primary/10 rounded w-full mb-12"></div>
          <div className="h-96 bg-primary/10 rounded w-full mb-12"></div>
        </div>
      </RootLayout>
    );
  }

  if (!article) return null;

  return (
    <RootLayout>
      <article className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-primary font-mono mb-6">
              <span>{article.category}</span>
              <span>•</span>
              <span>{article.readTime} {t("min read", "دقائق قراءة")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-8 leading-tight">
              {language === "ar" ? article.titleAr : article.title}
            </h1>
            
            {article.coverImage && (
              <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden mb-12 border border-border">
                <img 
                  src={article.coverImage} 
                  alt={language === "ar" ? article.titleAr : article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          <div className="prose prose-invert prose-lg prose-p:text-white/80 prose-headings:font-heading prose-a:text-primary max-w-none">
            <div dangerouslySetInnerHTML={{ __html: language === "ar" ? article.contentAr : article.content }} />
          </div>
        </div>
      </article>
    </RootLayout>
  );
}
