import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import { useGetMyMessages, useSendMessage } from "@workspace/api-client-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Send, MessageSquare } from "lucide-react";

export default function ClientMessages() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { data: rawMessages, isLoading } = useGetMyMessages();
  const messages = Array.isArray(rawMessages) ? rawMessages : [];
  const sendMessage = useSendMessage();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    
    sendMessage.mutate(
      { data: { content } },
      {
        onSuccess: () => {
          setContent("");
          queryClient.invalidateQueries({ queryKey: ["/api/client/messages"] });
        }
      }
    );
  };

  return (
    <ClientLayout>
      <div className="flex flex-col h-[calc(100vh-140px)] bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border bg-muted/30">
          <h2 className="font-bold font-heading text-lg">{t("Consultation Chat", "محادثة الاستشارة")}</h2>
          <p className="text-xs text-muted-foreground mt-1">{t("Messages are secured and private.", "الرسائل مؤمنة وخاصة.")}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                <div className="h-16 bg-muted rounded-2xl rounded-tl-none w-full" />
              </div>
              <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                <div className="h-12 bg-primary/20 rounded-2xl rounded-tr-none w-full" />
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/60 space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <MessageSquare className="w-8 h-8 opacity-50" />
              </div>
              <p>{t("Send a message to start the conversation.", "أرسل رسالة لبدء المحادثة.")}</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === user?.id;
              const isRtl = language === "ar";
              const myMessageClass = isRtl ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row-reverse';
              
              return (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMine ? myMessageClass : ''}`}>
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex shrink-0 items-center justify-center text-secondary text-xs font-bold mt-1 shadow-sm">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl shadow-sm ${isMine ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card border border-border text-foreground rounded-tl-none'}`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-2 font-medium ${isMine ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSend} className="p-4 bg-muted/30 border-t border-border flex gap-3 items-center">
          <Input 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("Type your message...", "اكتب رسالتك...")}
            className="flex-1 bg-background border-border shadow-sm focus-visible:ring-primary/20 rounded-full px-5 h-12"
          />
          <Button type="submit" size="icon" disabled={!content.trim() || sendMessage.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-12 rounded-full shrink-0 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100">
            <Send className={`w-5 h-5 ${language === "ar" ? "rotate-180" : ""}`} />
          </Button>
        </form>
      </div>
    </ClientLayout>
  );
}
