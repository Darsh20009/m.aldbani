import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListArticles } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminArticles() {
  const { data: rawArticles, isLoading } = useListArticles();
  const articles = Array.isArray(rawArticles) ? rawArticles : [];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2 text-white">Articles</h1>
          <p className="text-foreground/60">Manage insights, blog posts, and thought leadership content.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">Write Article</Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground/60">Title</TableHead>
              <TableHead className="text-foreground/60">Category</TableHead>
              <TableHead className="text-foreground/60">Status</TableHead>
              <TableHead className="text-foreground/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-border">
                <TableCell colSpan={4} className="text-center py-8 text-foreground/50 animate-pulse">Loading articles...</TableCell>
              </TableRow>
            ) : articles.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={4} className="text-center py-8 text-foreground/50">No articles found.</TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id} className="border-border hover:bg-primary/5">
                  <TableCell className="font-medium text-white">{article.title}</TableCell>
                  <TableCell className="text-foreground/70">{article.category}</TableCell>
                  <TableCell className="text-foreground/70">{article.published ? "Published" : "Draft"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-white">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
