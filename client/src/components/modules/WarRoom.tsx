import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Activity, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Agent {
  id: number;
  name: string;
  status: "online" | "offline" | "working" | "idle";
  tasksCompleted: number;
  updatedAt: Date;
}

interface ActivityEntry {
  id: number;
  agentId: number;
  action: string;
  createdAt: Date;
}

const copy = {
  en: {
    title: "War Room",
    subtitle: "AI agent command center",
    loading: "Loading data...",
    completedTasks: "Completed Tasks",
    lastSeen: "Last Seen",
    activity: "Activity Feed",
    noActivity: "No activity yet",
    totalAgents: "Total Agents",
    onlineAgents: "Online Agents",
    totalTasks: "Total Tasks",
    unknown: "Unknown",
    statuses: {
      online: "Online",
      working: "Working",
      idle: "Idle",
      offline: "Offline",
    },
  },
  my: {
    title: "စစ်ဆင်ရေးခန်း",
    subtitle: "AI အေဂျင့်များ ထိန်းချုပ်မှုဗဟို",
    loading: "အချက်အလက် ရယူနေသည်...",
    completedTasks: "ပြီးစီးသည့်အလုပ်များ",
    lastSeen: "နောက်ဆုံးတွေ့ရှိချိန်",
    activity: "လုပ်ဆောင်ချက်အစီအစဉ်",
    noActivity: "လုပ်ဆောင်ချက် မရှိပါ",
    totalAgents: "စုစုပေါင်း အေဂျင့်များ",
    onlineAgents: "အွန်လိုင်း အေဂျင့်များ",
    totalTasks: "စုစုပေါင်း အလုပ်များ",
    unknown: "မသိရ",
    statuses: {
      online: "အွန်လိုင်း",
      working: "အလုပ်လုပ်နေ",
      idle: "စောင့်ဆိုင်း",
      offline: "အော့ဖ်လိုင်း",
    },
  },
};

export default function WarRoom() {
  const { language } = useLanguage();
  const text = copy[language];
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: backendAgents, isLoading: agentsLoading } = trpc.agents.list.useQuery();
  const { data: backendActivity, isLoading: activityLoading } = trpc.activityFeed.list.useQuery();

  const mockAgents: Agent[] = useMemo(
    () => [
      { id: 1, name: "Ultron", status: "online", tasksCompleted: 1247, updatedAt: new Date() },
      { id: 2, name: "Forge", status: "working", tasksCompleted: 856, updatedAt: new Date() },
      { id: 3, name: "AI DJ Vibes", status: "online", tasksCompleted: 342, updatedAt: new Date() },
      { id: 4, name: "Research Bot", status: "online", tasksCompleted: 523, updatedAt: new Date() },
      { id: 5, name: "Media Scheduler", status: "offline", tasksCompleted: 198, updatedAt: new Date() },
    ],
    []
  );

  const mockActivity: ActivityEntry[] = useMemo(
    () =>
      language === "my"
        ? [
            { id: 1, agentId: 2, action: "Etsy ဒီဇိုင်း ၅ ခု ထုတ်ပေးပြီး", createdAt: new Date() },
            { id: 2, agentId: 4, action: "ပြိုင်ဘက်ဆိုင် ၃ ခု ခွဲခြမ်းစိတ်ဖြာပြီး", createdAt: new Date() },
            { id: 3, agentId: 3, action: "နောက်ခံဂီတ ၂ ခု ဖန်တီးပြီး", createdAt: new Date() },
            { id: 4, agentId: 1, action: "စနစ်ကျန်းမာရေး စစ်ဆေးပြီး", createdAt: new Date() },
          ]
        : [
            { id: 1, agentId: 2, action: "Generated 5 Etsy designs", createdAt: new Date() },
            { id: 2, agentId: 4, action: "Analyzed 3 competitor stores", createdAt: new Date() },
            { id: 3, agentId: 3, action: "Created 2 background tracks", createdAt: new Date() },
            { id: 4, agentId: 1, action: "Completed system health checks", createdAt: new Date() },
          ],
    [language]
  );

  useEffect(() => {
    setIsLoading(agentsLoading || activityLoading);
    setAgents(backendAgents && backendAgents.length > 0 ? (backendAgents as Agent[]) : mockAgents);
    setActivityFeed(
      backendActivity && backendActivity.length > 0 ? (backendActivity as ActivityEntry[]) : mockActivity
    );
  }, [backendAgents, backendActivity, agentsLoading, activityLoading, mockAgents, mockActivity]);

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "online":
        return "bg-neon-green";
      case "working":
        return "bg-neon-yellow";
      case "idle":
        return "bg-neon-purple";
      case "offline":
        return "bg-neon-red";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return language === "my" ? "ယခု" : "just now";
    if (diffMins < 60) return language === "my" ? `${diffMins} မိနစ်အကြာ` : `${diffMins}m ago`;
    if (diffHours < 24) return language === "my" ? `${diffHours} နာရီအကြာ` : `${diffHours}h ago`;
    return language === "my" ? `${Math.floor(diffHours / 24)} ရက်အကြာ` : `${Math.floor(diffHours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold neon-glow-pink">{text.title}</h1>
          <p className="text-neon-cyan">{text.subtitle}</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">{text.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold neon-glow-pink">{text.title}</h1>
        <p className="text-neon-cyan">{text.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="border border-neon-border rounded-sm p-6 bg-card/50 hover:bg-card transition-all duration-300 neon-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(agent.status)} animate-pulse`} />
                <div>
                  <h3 className="font-bold text-neon-cyan">{agent.name}</h3>
                  <p className="text-xs text-neon-green">{text.statuses[agent.status]}</p>
                </div>
              </div>
              <Zap className="w-5 h-5 text-neon-pink" />
            </div>

            <div className="space-y-3">
              <div className="border-t border-neon-border/30 pt-3">
                <p className="text-xs text-muted-foreground mb-1">{text.completedTasks}</p>
                <p className="text-2xl font-bold text-neon-green">{agent.tasksCompleted}</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{text.lastSeen}</span>
                <span className="text-neon-cyan">{formatTime(agent.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-neon-pink" />
          <h2 className="text-2xl font-bold neon-glow-cyan">{text.activity}</h2>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activityFeed.length > 0 ? (
            activityFeed.map((entry) => {
              const agent = agents.find(a => a.id === entry.agentId);
              return (
                <div key={entry.id} className="flex items-start gap-4 pb-4 border-b border-neon-border/20 last:border-b-0">
                  <div className="w-2 h-2 bg-neon-pink rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-neon-cyan">{agent?.name || text.unknown}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(entry.createdAt)}</span>
                    </div>
                    <p className="text-sm text-foreground">{entry.action}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted-foreground text-center py-8">{text.noActivity}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">{text.totalAgents}</p>
          <p className="text-3xl font-bold text-neon-green">{agents.length}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">{text.onlineAgents}</p>
          <p className="text-3xl font-bold text-neon-cyan">{agents.filter(a => a.status === "online").length}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">{text.totalTasks}</p>
          <p className="text-3xl font-bold text-neon-yellow">{agents.reduce((sum, a) => sum + a.tasksCompleted, 0)}</p>
        </div>
      </div>
    </div>
  );
}

