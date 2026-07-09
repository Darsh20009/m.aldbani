import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useListCommunityPosts, useReactToPost } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Community() {
  const { t, language } = useLanguage();
  const { data: rawPosts, isLoading } = useListCommunityPosts();
  const posts = Array.isArray(rawPosts) ? rawPosts : [];
  const reactToPost = useReactToPost();

  const handleReact = (postId: string, emoji: string) => {
    reactToPost.mutate({ id: postId, data: { emoji } });
  };

  return (
    <RootLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold font-heading mb-4">
              {t("MD Community Feed", "مجتمع MD")}
            </h1>
            <p className="text-foreground/60 text-lg">
              {t("Exclusive updates, quick thoughts, and behind-the-scenes insights.", "تحديثات حصرية، أفكار سريعة، وكواليس العمل.")}
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-xl p-6 h-64 animate-pulse" />
              ))
            ) : (
              posts.map((post, i) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12 border border-primary/20">
                      <AvatarImage src="/assets/Screenshot_2026-06-22_at_8.55.58_PM_1782151064834.png" />
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold font-heading">Mohammed Al-Dabbani</h3>
                      <p className="text-xs text-foreground/50">{format(new Date(post.publishedAt || Date.now()), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="max-w-none mb-4">
                    <h4 className="text-lg font-bold mb-2 text-foreground">{post.title}</h4>
                    <p className="text-foreground/70 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  </div>
                  
                  {post.image && (
                    <div className="rounded-lg overflow-hidden mb-4 border border-border">
                      <img src={post.image} alt={post.title} className="w-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-white" onClick={() => handleReact(post.id, '👍')}>
                        👍 {post.reactions?.find((r: { emoji: string; count: number }) => r.emoji === '👍')?.count || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-white" onClick={() => handleReact(post.id, '🚀')}>
                        🚀 {post.reactions?.find((r: { emoji: string; count: number }) => r.emoji === '🚀')?.count || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-white" onClick={() => handleReact(post.id, '💡')}>
                        💡 {post.reactions?.find((r: { emoji: string; count: number }) => r.emoji === '💡')?.count || 0}
                      </Button>
                    </div>
                    <div className="text-sm text-white/40">
                      {post.seenCount || 0} {t("views", "مشاهدة")}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            
            {!isLoading && posts.length === 0 && (
              <div className="text-center py-12 text-foreground/50 border border-border rounded-xl border-dashed">
                {t("No posts yet.", "لا توجد منشورات بعد.")}
              </div>
            )}
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
