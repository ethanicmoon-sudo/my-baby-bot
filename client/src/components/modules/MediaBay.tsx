import { Video, Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ScheduledContent {
  id: string;
  title: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'draft';
  thumbnail?: string;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  scheduledCount: number;
}

export default function MediaBay() {
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([
    {
      id: '1',
      title: 'Neon Design Showcase',
      platform: 'tiktok',
      scheduledTime: 'မြန်းလည် ၂:၀၀ PM',
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Behind the Scenes',
      platform: 'tiktok',
      scheduledTime: 'မြန်းလည် ၆:၀၀ PM',
      status: 'scheduled',
    },
    {
      id: '3',
      title: 'Product Tutorial',
      platform: 'youtube',
      scheduledTime: 'မနက်ခင်း ၁၀:၀၀ AM',
      status: 'published',
    },
    {
      id: '4',
      title: 'Design Tips & Tricks',
      platform: 'instagram',
      scheduledTime: 'မြန်းလည် ၃:၃၀ PM',
      status: 'draft',
    },
  ]);

  const [calendarView, setCalendarView] = useState('week');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'text-neon-pink';
      case 'instagram':
        return 'text-neon-purple';
      case 'youtube':
        return 'text-neon-red';
      default:
        return 'text-neon-cyan';
    }
  };

  const getPlatformLabel = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-neon-cyan/20 text-neon-cyan';
      case 'published':
        return 'bg-neon-green/20 text-neon-green';
      case 'draft':
        return 'bg-neon-yellow/20 text-neon-yellow';
      default:
        return 'bg-neon-purple/20 text-neon-purple';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'အချိန်ဇယား ပြုလုပ်ထားသည်';
      case 'published':
        return 'ထုတ်ဝေပြီး';
      case 'draft':
        return 'မူကြမ်း';
      default:
        return status;
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverDay(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, dayNum: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDay(dayNum);
  };

  const handleDragLeave = () => {
    setDragOverDay(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dayNum: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Find the dragged content
    const draggedContent = scheduledContent.find(c => c.id === draggedItem);
    if (!draggedContent) return;

    // Update the scheduled time (mock - in real app would format actual date)
    const updatedContent = scheduledContent.map(c =>
      c.id === draggedItem
        ? { ...c, scheduledTime: `Day ${dayNum}`, status: 'scheduled' as const }
        : c
    );

    setScheduledContent(updatedContent);
    setDraggedItem(null);
    setDragOverDay(null);
    toast.success(`"${draggedContent.title}" scheduled for day ${dayNum}`);
  };

  const handleDeleteContent = (id: string) => {
    const content = scheduledContent.find(c => c.id === id);
    setScheduledContent(scheduledContent.filter(c => c.id !== id));
    toast.success(`"${content?.title}" removed from schedule`);
  };

  const handleAddContent = () => {
    toast.info('Feature coming soon: Add new content');
  };

  const handlePublishContent = (id: string) => {
    const updatedContent = scheduledContent.map(c =>
      c.id === id ? { ...c, status: 'published' as const } : c
    );
    setScheduledContent(updatedContent);
    toast.success('Content published successfully');
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold neon-glow-pink">မီဒီယာ အခန်း</h1>
        <p className="text-neon-cyan">ဗီဒီယို အချိန်ဇယား နှင့် ကွန်တင်တ် စီမံခန့်ခွဲမှု</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">စုစုပေါင်း ကွန်တင်တ်များ</p>
          <p className="text-3xl font-bold text-neon-cyan">{scheduledContent.length}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">အချိန်ဇယား ပြုလုပ်ထားသည်</p>
          <p className="text-3xl font-bold text-neon-green">{scheduledContent.filter(c => c.status === 'scheduled').length}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">ထုတ်ဝေပြီး</p>
          <p className="text-3xl font-bold text-neon-purple">{scheduledContent.filter(c => c.status === 'published').length}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">မူကြမ်း</p>
          <p className="text-3xl font-bold text-neon-yellow">{scheduledContent.filter(c => c.status === 'draft').length}</p>
        </div>
      </div>

      {/* Calendar View */}
      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold neon-glow-cyan">ကွန်တင်တ် ပြက္ခဒိန်</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCalendarView('week')}
              className={`px-4 py-2 rounded-sm font-medium transition-all ${
                calendarView === 'week'
                  ? 'bg-neon-pink text-background'
                  : 'border border-neon-border text-foreground hover:bg-card'
              }`}
            >
              အပတ်စဉ်
            </button>
            <button
              onClick={() => setCalendarView('month')}
              className={`px-4 py-2 rounded-sm font-medium transition-all ${
                calendarView === 'month'
                  ? 'bg-neon-pink text-background'
                  : 'border border-neon-border text-foreground hover:bg-card'
              }`}
            >
              လစဉ်
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {['တ', 'ဂ', 'အ', 'ဗ', 'ဗ', 'သ', 'စ'].map((day, idx) => (
            <div key={idx} className="text-center py-2 text-neon-cyan font-bold text-sm">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, idx) => {
            const dayNum = idx + 1 <= 28 ? idx + 1 : null;
            const isWeekend = idx % 7 === 0 || idx % 7 === 6;
            const isCurrentMonth = dayNum !== null;
            const isDropTarget = draggedItem !== null && isCurrentMonth;

            return (
              <div
                key={idx}
                onDragOver={(e) => isCurrentMonth && dayNum && handleDragOver(e, dayNum)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => isCurrentMonth && dayNum && handleDrop(e, dayNum)}
                className={`aspect-square border rounded-sm flex flex-col items-center justify-center text-sm transition-all ${
                  isWeekend && isCurrentMonth
                    ? 'border-neon-border/20 bg-background/30'
                    : isCurrentMonth
                    ? `border-neon-border/30 ${
                        dragOverDay === dayNum
                          ? 'bg-neon-pink/30 border-neon-pink'
                          : 'hover:bg-neon-pink/10 cursor-pointer'
                      }`
                    : 'border-neon-border/10'
                }`}
              >
                {dayNum && (
                  <>
                    <span className="font-bold text-foreground">{dayNum}</span>
                    {scheduledContent.some(c => c.scheduledTime.includes(`Day ${dayNum}`)) && (
                      <span className="text-xs text-neon-green mt-1">•</span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Content List */}
      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold neon-glow-green">အချိန်ဇယား ပြုလုပ်ထားသော ကွန်တင်တ်များ</h2>
          <button
            onClick={handleAddContent}
            className="px-4 py-2 bg-neon-pink text-background font-bold rounded-sm hover:bg-neon-pink/80 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            အသစ် ထည့်သွင်းရန်
          </button>
        </div>

        <div className="space-y-3">
          {scheduledContent.length > 0 ? (
            scheduledContent.map((content) => (
              <div
                key={content.id}
                draggable
                onDragStart={(e) => handleDragStart(e, content.id)}
                onDragEnd={handleDragEnd}
                className={`border rounded-sm p-4 transition-all cursor-move ${
                  draggedItem === content.id
                    ? 'border-neon-pink bg-neon-pink/20 opacity-70'
                    : 'border-neon-border/30 bg-background/50 hover:bg-background hover:border-neon-pink/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-neon-pink to-neon-cyan rounded-sm flex items-center justify-center flex-shrink-0">
                      <Video className="w-8 h-8 text-background" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-neon-cyan mb-1">{content.title}</h3>
                      <div className="flex items-center gap-3 text-sm flex-wrap">
                        <span className={`font-medium ${getPlatformColor(content.platform)}`}>
                          {getPlatformLabel(content.platform)}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {content.scheduledTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-sm ${getStatusBadgeColor(content.status)}`}>
                      {getStatusLabel(content.status)}
                    </span>
                    {content.status === 'scheduled' && (
                      <button
                        onClick={() => handlePublishContent(content.id)}
                        className="px-2 py-1 text-xs bg-neon-green/20 text-neon-green rounded-sm hover:bg-neon-green/30 transition-colors"
                      >
                        ထုတ်ဝေ
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteContent(content.id)}
                      className="px-2 py-1 text-xs bg-neon-red/20 text-neon-red rounded-sm hover:bg-neon-red/30 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">ကွန်တင်တ် မရှိပါ</p>
            </div>
          )}
        </div>
      </div>

      {/* Drag & Drop Instructions */}
      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <p className="text-neon-cyan font-bold mb-3">💡 အကြံပြုချက်</p>
        <p className="text-foreground text-sm mb-3">
          ကွန်တင်တ်များကို ပြက္ခဒိန်ရှိ နေ့များတွင် ဆွဲထည့်ပါ။ သင်၏ ကွန်တင်တ်များ အချိန်ဇယား ပြုလုပ်ပြီး TikTok တွင် ထုတ်ဝေလိမ့်မည်။
        </p>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>• ကွန်တင်တ်ကို ဆွဲပြီး ပြက္ခဒိန်ရှိ နေ့ပေါ် လျှော်ချပါ</p>
          <p>• အချိန်ဇယား ပြုလုပ်ထားသော ကွန်တင်တ်များကို "ထုတ်ဝေ" ခလုတ်ဖြင့် ထုတ်ဝေပါ</p>
          <p>• မလိုအပ်သော ကွန်တင်တ်များကို ဖျက်ပါ</p>
        </div>
      </div>
    </div>
  );
}
