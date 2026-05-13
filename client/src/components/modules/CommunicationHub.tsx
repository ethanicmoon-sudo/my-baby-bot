import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, useState } from "react";

interface Message {
  id: string;
  type: "tiktok" | "email" | "youtube";
  sender: string;
  content: string;
  timestamp: string;
  unread: boolean;
}

export default function CommunicationHub() {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState<"all" | "tiktok" | "email" | "youtube">("all");

  const text = language === "my"
    ? {
        title: "ဆက်သွယ်ရေးဗဟို",
        subtitle: "TikTok, Email, YouTube စာများစုပေါင်းစီမံမှု",
        total: "စုစုပေါင်း မက်ဆေ့ချ်",
        unread: "မဖတ်ရသေး",
        noMessage: "မက်ဆေ့ချ် မရှိပါ",
        all: "အားလုံး",
        quickReplies: "အမြန်အဖြေများ",
      }
    : {
        title: "Communication Hub",
        subtitle: "Unified inbox for TikTok, Email, and YouTube",
        total: "Total Messages",
        unread: "Unread",
        noMessage: "No messages found",
        all: "All",
        quickReplies: "Quick Replies",
      };

  const messages: Message[] = useMemo(
    () =>
      language === "my"
        ? [
            { id: "1", type: "tiktok", sender: "@creative_user", content: "ဒီဒီဇိုင်းကို ကြိုက်ပါတယ်။ မေးချင်တာတချို့ရှိပါတယ်။", timestamp: "2 မိနစ်အကြာ", unread: true },
            { id: "2", type: "email", sender: "customer@example.com", content: "Order status update ပေးပါ။", timestamp: "5 မိနစ်အကြာ", unread: true },
            { id: "3", type: "youtube", sender: "YouTubeUser123", content: "နောက်ဗီဒီယိုတင်မယ့်ရက်ဘယ်နေ့လဲ?", timestamp: "8 မိနစ်အကြာ", unread: false },
            { id: "4", type: "tiktok", sender: "@design_lover", content: "ဒီ content ကို share လုပ်လိုက်ပါတယ်။", timestamp: "15 မိနစ်အကြာ", unread: false },
          ]
        : [
            { id: "1", type: "tiktok", sender: "@creative_user", content: "Love this design. Can I place a custom order?", timestamp: "2m ago", unread: true },
            { id: "2", type: "email", sender: "customer@example.com", content: "Please share my order status update.", timestamp: "5m ago", unread: true },
            { id: "3", type: "youtube", sender: "YouTubeUser123", content: "When is the next tutorial video coming?", timestamp: "8m ago", unread: false },
            { id: "4", type: "tiktok", sender: "@design_lover", content: "Shared this post with my community.", timestamp: "15m ago", unread: false },
          ],
    [language]
  );

  const filteredMessages = filterType === "all" ? messages : messages.filter(m => m.type === filterType);
  const unreadCount = messages.filter(m => m.unread).length;

  const typeLabel = (type: Message["type"]) => {
    if (type === "tiktok") return "TikTok";
    if (type === "email") return "Email";
    return "YouTube";
  };

  const icon = (type: Message["type"]) => {
    if (type === "tiktok") return "TT";
    if (type === "email") return "EM";
    return "YT";
  };

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold neon-glow-purple">{text.title}</h1>
        <p className="text-neon-cyan">{text.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">{text.total}</p>
          <p className="text-3xl font-bold text-neon-cyan">{messages.length}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">{text.unread}</p>
          <p className="text-3xl font-bold text-neon-pink">{unreadCount}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">TikTok</p>
          <p className="text-3xl font-bold text-neon-green">{messages.filter(m => m.type === "tiktok").length}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">Email</p>
          <p className="text-3xl font-bold text-neon-purple">{messages.filter(m => m.type === "email").length}</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-2 rounded-sm font-medium transition-all ${
            filterType === "all" ? "bg-neon-pink text-background neon-glow-pink" : "border border-neon-border text-foreground hover:bg-card/50"
          }`}
        >
          {text.all}
        </button>
        <button
          onClick={() => setFilterType("tiktok")}
          className={`px-4 py-2 rounded-sm font-medium transition-all ${
            filterType === "tiktok" ? "bg-neon-cyan text-background neon-glow-cyan" : "border border-neon-border text-foreground hover:bg-card/50"
          }`}
        >
          TikTok
        </button>
        <button
          onClick={() => setFilterType("email")}
          className={`px-4 py-2 rounded-sm font-medium transition-all ${
            filterType === "email" ? "bg-neon-green text-background neon-glow-green" : "border border-neon-border text-foreground hover:bg-card/50"
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setFilterType("youtube")}
          className={`px-4 py-2 rounded-sm font-medium transition-all ${
            filterType === "youtube" ? "bg-neon-purple text-background" : "border border-neon-border text-foreground hover:bg-card/50"
          }`}
        >
          YouTube
        </button>
      </div>

      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border space-y-3">
        {filteredMessages.length > 0 ? (
          filteredMessages.map(message => (
            <div key={message.id} className={`border rounded-sm p-4 transition-all ${message.unread ? "border-neon-pink bg-neon-pink/5" : "border-neon-border/30 bg-background/50"}`}>
              <div className="flex items-start gap-4">
                <div className="text-xs px-2 py-1 border border-neon-border rounded-sm text-neon-cyan">{icon(message.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neon-cyan">{message.sender}</span>
                      <span className="text-xs px-2 py-1 bg-neon-pink/20 text-neon-pink rounded-sm">{typeLabel(message.type)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="text-foreground text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{text.noMessage}</p>
          </div>
        )}
      </div>

      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <h2 className="text-xl font-bold neon-glow-cyan mb-4">{text.quickReplies}</h2>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 border border-neon-border/30 rounded-sm hover:bg-background/50 transition-colors">
            <p className="text-foreground font-medium">{language === "my" ? "ကျေးဇူးတင်ပါတယ်။ order အတည်ပြုလိုက်ပါပြီ။" : "Thanks! Your order is confirmed."}</p>
          </button>
          <button className="w-full text-left px-4 py-3 border border-neon-border/30 rounded-sm hover:bg-background/50 transition-colors">
            <p className="text-foreground font-medium">{language === "my" ? "အသစ်ထပ်လာမယ့် release ကို စောင့်ကြည့်ပါ။" : "Stay tuned for our next release."}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

