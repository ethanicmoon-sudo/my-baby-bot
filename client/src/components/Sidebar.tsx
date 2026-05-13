import { useLanguage, type LanguageCode } from "@/contexts/LanguageContext";
import {
  Archive,
  CheckCircle,
  Cpu,
  MessageSquare,
  Microscope,
  TrendingUp,
  Video,
  Zap,
} from "lucide-react";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const copy = {
  en: {
    brandSub: "AI Agent",
    language: "Language",
    systemStatus: "System Status",
    online: "Online",
    modules: {
      "war-room": "War Room",
      "factory-room": "Factory Room",
      "research-lab": "Research Lab",
      communication: "Communication Hub",
      "media-bay": "Media Bay",
      feedback: "Feedback Loop",
      archives: "Archives",
      revenue: "Revenue Dashboard",
    } as Record<string, string>,
  },
  my: {
    brandSub: "AI အေဂျင့်",
    language: "ဘာသာစကား",
    systemStatus: "စနစ် အခြေအနေ",
    online: "အွန်လိုင်း",
    modules: {
      "war-room": "စစ်ဆင်ရေးခန်း",
      "factory-room": "စက်ရုံခန်း",
      "research-lab": "သုတေသနခန်း",
      communication: "ဆက်သွယ်ရေးဗဟို",
      "media-bay": "မီဒီယာခန်း",
      feedback: "တုံ့ပြန်ချက်စက်ဝိုင်း",
      archives: "မှတ်တမ်းခန်း",
      revenue: "ဝင်ငွေဒက်ရှ်ဘုတ်",
    } as Record<string, string>,
  },
};

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const { language, setLanguage } = useLanguage();
  const text = copy[language];

  const modules = [
    { id: "war-room", label: text.modules["war-room"], icon: Zap, color: "text-neon-pink" },
    { id: "factory-room", label: text.modules["factory-room"], icon: Cpu, color: "text-neon-cyan" },
    { id: "research-lab", label: text.modules["research-lab"], icon: Microscope, color: "text-neon-green" },
    { id: "communication", label: text.modules.communication, icon: MessageSquare, color: "text-neon-purple" },
    { id: "media-bay", label: text.modules["media-bay"], icon: Video, color: "text-neon-pink" },
    { id: "feedback", label: text.modules.feedback, icon: CheckCircle, color: "text-neon-cyan" },
    { id: "archives", label: text.modules.archives, icon: Archive, color: "text-neon-green" },
    { id: "revenue", label: text.modules.revenue, icon: TrendingUp, color: "text-neon-purple" },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-neon-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-pink rounded-full flex items-center justify-center neon-glow-pink">
            <Zap className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-lg font-bold neon-glow-pink">ULTRON</h1>
            <p className="text-xs text-sidebar-foreground">{text.brandSub}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;

          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent border border-neon-pink neon-border"
                  : "hover:bg-sidebar-accent/50 border border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 ${module.color}`} />
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-sidebar-accent-foreground neon-glow" : "text-sidebar-foreground"
                }`}
              >
                {module.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-3 border border-neon-border rounded-sm p-3 bg-card/50">
          <p className="text-xs text-sidebar-foreground mb-2">{text.language}</p>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as LanguageCode)}
            className="w-full bg-background border border-neon-border text-xs px-2 py-2 rounded-sm outline-none focus:ring-1 focus:ring-neon-cyan"
          >
            <option value="my">Myanmar</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="bg-card/50 border border-neon-border rounded-sm p-3">
          <p className="text-xs text-sidebar-foreground mb-2">{text.systemStatus}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full status-online" />
            <span className="text-xs text-neon-green neon-glow-green">{text.online}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

