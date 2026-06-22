import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useAuth } from "../../hooks/use-auth";
import { useGetMyMessages, useSendMessage } from "@workspace/api-client-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export default function ClientMessages() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: messages = [], isLoading } = useGetMyMessages();
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
      <div className="flex flex-col h-[calc(100vh-140px)] glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border bg-white/5">
          <h2 className="font-bold font-heading">{t("Consultation Chat", "محادثة الاستشارة")}</h2>
          <p className="text-xs text-foreground/50">{t("Messages are secured and private.", "الرسائل مؤمنة وخاصة.")}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-primary/10" />
                <div className="h-16 bg-primary/10 rounded-xl rounded-tl-none w-full" />
              </div>
              <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                <div className="h-12 bg-primary/10 rounded-xl rounded-tr-none w-full" />
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/40">
              {t("Send a message to start the conversation.", "أرسل رسالة لبدء المحادثة.")}
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMine ? 'ml-auto flex-row-reverse' : ''}`}>
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex shrink-0 items-center justify-center text-primary text-xs font-bold mt-1">
                      {msg.senderName.charAt(0)}
                    </div>
                  )}
                  <div className={`p-4 rounded-xl ${isMine ? 'bg-primary text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'}`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-2 ${isMine ? 'text-primary-foreground/60 text-right' : 'text-white/40 text-left'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-border flex gap-2">
          <Input 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("Type your message...", "اكتب رسالتك...")}
            className="flex-1 bg-background/50 border-border"
          />
          <Button type="submit" disabled={!content.trim() || sendMessage.isPending} className="bg-primary hover:bg-primary/90 text-white">
            {t("Send", "إرسال")}
          </Button>
        </form>
      </div>
    </ClientLayout>
  );
}
