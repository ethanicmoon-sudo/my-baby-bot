import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Cpu, Music } from "lucide-react";
import { useMemo, useState } from "react";

interface DesignJob {
  id: string;
  name: string;
  status: "completed" | "processing" | "queued";
  progress: number;
}

export default function FactoryRoom() {
  const { language } = useLanguage();
  const text = language === "my"
    ? {
        title: "စက်ရုံခန်း",
        subtitle: "ဒီဇိုင်းထုတ်လုပ်မှုနှင့် ထုတ်ကုန် sync စနစ်",
        designPanel: "ဒီဇိုင်းထုတ်လုပ်မှု",
        musicPanel: "AI DJ Vibes - ဂီတဖန်တီးမှု",
        createTrack: "အသစ် ဂီတဖန်တီးရန်",
        done: "ပြီးစီး",
        processing: "လုပ်ဆောင်နေ",
        queued: "တန်းစီ",
        completedPercent: "ပြီးစီးမှု",
        lastSync: "နောက်ဆုံး sync",
        syncedItems: "sync ပြီးထုတ်ကုန်",
        connected: "ချိတ်ဆက်ထားသည်",
      }
    : {
        title: "Factory Room",
        subtitle: "Design production and fulfillment sync",
        designPanel: "Design Production",
        musicPanel: "AI DJ Vibes - Music Generation",
        createTrack: "Create New Track",
        done: "Completed",
        processing: "Processing",
        queued: "Queued",
        completedPercent: "Progress",
        lastSync: "Last sync",
        syncedItems: "Synced items",
        connected: "Connected",
      };

  const [designs] = useState<DesignJob[]>([
    { id: "1", name: "Etsy Neon T-shirt", status: "completed", progress: 100 },
    { id: "2", name: "Etsy Icon Pack", status: "processing", progress: 75 },
    { id: "3", name: "Printify Catalog Sync", status: "completed", progress: 100 },
    { id: "4", name: "Printful Catalog Sync", status: "processing", progress: 45 },
    { id: "5", name: "Hoodie Bundle Batch", status: "queued", progress: 0 },
  ]);

  const tracks = useMemo(
    () => [
      { id: "1", name: "Ambient Cyberpunk Mix", duration: "3:45", status: "completed" },
      { id: "2", name: "Synthwave Background", duration: "4:20", status: "processing" },
      { id: "3", name: "Electronic Vibes", duration: "2:50", status: "completed" },
    ],
    []
  );

  const getStatusLabel = (status: DesignJob["status"]) => {
    if (status === "completed") return text.done;
    if (status === "processing") return text.processing;
    return text.queued;
  };

  const getStatusColor = (status: DesignJob["status"]) => {
    if (status === "completed") return "text-neon-green";
    if (status === "processing") return "text-neon-yellow";
    return "text-neon-purple";
  };

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold neon-glow-cyan">{text.title}</h1>
        <p className="text-neon-pink">{text.subtitle}</p>
      </div>

      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <div className="flex items-center gap-3 mb-6">
          <Cpu className="w-6 h-6 text-neon-cyan" />
          <h2 className="text-2xl font-bold neon-glow-cyan">{text.designPanel}</h2>
        </div>
        <div className="space-y-4">
          {designs.map(design => (
            <div key={design.id} className="border border-neon-border/30 rounded-sm p-4 bg-background/50">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-foreground">{design.name}</span>
                <span className={`text-xs font-bold ${getStatusColor(design.status)}`}>{getStatusLabel(design.status)}</span>
              </div>
              <div className="w-full bg-background border border-neon-border/20 rounded-sm h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan" style={{ width: `${design.progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{text.completedPercent}: {design.progress}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-neon-green" />
            <h3 className="text-xl font-bold text-neon-green">Printify</h3>
          </div>
          <p className="text-sm text-foreground">{text.lastSync}: <span className="text-neon-cyan font-bold">5m</span></p>
          <p className="text-sm text-foreground">{text.syncedItems}: <span className="text-neon-green font-bold">247</span></p>
          <div className="mt-3 p-2 bg-neon-green/10 border border-neon-green/30 rounded-sm text-xs text-neon-green">{text.connected}</div>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-neon-cyan" />
            <h3 className="text-xl font-bold text-neon-cyan">Printful</h3>
          </div>
          <p className="text-sm text-foreground">{text.lastSync}: <span className="text-neon-cyan font-bold">12m</span></p>
          <p className="text-sm text-foreground">{text.syncedItems}: <span className="text-neon-green font-bold">189</span></p>
          <div className="mt-3 p-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-sm text-xs text-neon-cyan">{text.connected}</div>
        </div>
      </div>

      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <div className="flex items-center gap-3 mb-6">
          <Music className="w-6 h-6 text-neon-pink" />
          <h2 className="text-2xl font-bold neon-glow-pink">{text.musicPanel}</h2>
        </div>
        <div className="space-y-3">
          {tracks.map(track => (
            <div key={track.id} className="border border-neon-border/30 rounded-sm p-4 bg-background/50 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{track.name}</p>
                <p className="text-xs text-muted-foreground">{track.duration}</p>
              </div>
              <span className={`text-xs font-bold ${track.status === "completed" ? "text-neon-green" : "text-neon-yellow"}`}>
                {track.status === "completed" ? text.done : text.processing}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-6 w-full py-3 px-4 bg-neon-pink text-background font-bold rounded-sm hover:bg-neon-pink/80 transition-colors neon-glow-pink">
          {text.createTrack}
        </button>
      </div>
    </div>
  );
}

