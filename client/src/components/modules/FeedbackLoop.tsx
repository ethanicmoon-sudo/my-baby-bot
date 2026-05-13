import { CheckCircle, XCircle, RefreshCw, Image } from 'lucide-react';
import { useState } from 'react';

interface DesignReview {
  id: string;
  title: string;
  generatedBy: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'iterating';
}

export default function FeedbackLoop() {
  const [designs, setDesigns] = useState<DesignReview[]>([
    {
      id: '1',
      title: 'Neon Aesthetic T-Shirt Design',
      generatedBy: 'Forge',
      timestamp: '2 မိနစ်အရင်',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Cyberpunk Mug Design',
      generatedBy: 'Forge',
      timestamp: '5 မိနစ်အရင်',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Minimalist Poster Design',
      generatedBy: 'Forge',
      timestamp: '8 မိနစ်အရင်',
      status: 'iterating',
    },
    {
      id: '4',
      title: 'Retro Gaming Design',
      generatedBy: 'Forge',
      timestamp: '12 မိနစ်အရင်',
      status: 'approved',
    },
    {
      id: '5',
      title: 'Abstract Art Design',
      generatedBy: 'Forge',
      timestamp: '15 မိနစ်အရင်',
      status: 'rejected',
    },
  ]);

  const [selectedDesign, setSelectedDesign] = useState<string | null>(designs[0]?.id);

  const handleApprove = (id: string) => {
    setDesigns(designs.map(d => d.id === id ? { ...d, status: 'approved' } : d));
    const nextPending = designs.find(d => d.id !== id && d.status === 'pending');
    if (nextPending) {
      setSelectedDesign(nextPending.id);
    }
  };

  const handleReject = (id: string) => {
    setDesigns(designs.map(d => d.id === id ? { ...d, status: 'rejected' } : d));
    const nextPending = designs.find(d => d.id !== id && d.status === 'pending');
    if (nextPending) {
      setSelectedDesign(nextPending.id);
    }
  };

  const handleIterate = (id: string) => {
    setDesigns(designs.map(d => d.id === id ? { ...d, status: 'iterating' } : d));
  };

  const selectedDesignData = designs.find(d => d.id === selectedDesign);
  const pendingCount = designs.filter(d => d.status === 'pending').length;
  const approvedCount = designs.filter(d => d.status === 'approved').length;
  const rejectedCount = designs.filter(d => d.status === 'rejected').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-neon-yellow';
      case 'approved':
        return 'text-neon-green';
      case 'rejected':
        return 'text-neon-red';
      case 'iterating':
        return 'text-neon-cyan';
      default:
        return 'text-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'စောင့်ဆိုင်းနေ';
      case 'approved':
        return 'အတည်ပြုပြီး';
      case 'rejected':
        return 'ပယ်ဖျက်ပြီး';
      case 'iterating':
        return 'ပြုပြင်နေ';
      default:
        return status;
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold neon-glow-cyan">အကြံပြုချက် လူပ</h1>
        <p className="text-neon-pink">AI ထုတ်ပေးသော ဒီဇိုင်းများ ပြန်လည်သုံးသပ်ခြင်း</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">စုစုပေါင်း ဒီဇိုင်းများ</p>
          <p className="text-3xl font-bold text-neon-cyan">{designs.length}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">စောင့်ဆိုင်းနေ</p>
          <p className="text-3xl font-bold text-neon-yellow">{pendingCount}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">အတည်ပြုပြီး</p>
          <p className="text-3xl font-bold text-neon-green">{approvedCount}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">ပယ်ဖျက်ပြီး</p>
          <p className="text-3xl font-bold text-neon-red">{rejectedCount}</p>
        </div>
      </div>

      {/* Main Review Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Design Preview */}
        <div className="lg:col-span-2 border border-neon-border rounded-sm p-8 bg-card/50 neon-border">
          {selectedDesignData ? (
            <div className="space-y-6">
              {/* Preview Image */}
              <div className="w-full aspect-square bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 border border-neon-border rounded-sm flex items-center justify-center">
                <div className="text-center">
                  <Image className="w-16 h-16 text-neon-pink mx-auto mb-3 opacity-50" />
                  <p className="text-neon-cyan text-sm">ဒီဇိုင်း အစမ်း ပြသခြင်း</p>
                </div>
              </div>

              {/* Design Info */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold neon-glow-cyan">{selectedDesignData.title}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-neon-border/30 rounded-sm p-3 bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">ထုတ်ပေးသူ</p>
                    <p className="text-foreground font-bold">{selectedDesignData.generatedBy}</p>
                  </div>
                  <div className="border border-neon-border/30 rounded-sm p-3 bg-background/50">
                    <p className="text-xs text-muted-foreground mb-1">အချိန်</p>
                    <p className="text-foreground font-bold">{selectedDesignData.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <p className="text-sm text-neon-cyan font-bold">ဤဒီဇိုင်းအတွက် ဆုံးဖြတ်ချက်ခွင့်ပြုပါ:</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleApprove(selectedDesignData.id)}
                    className="py-3 px-4 bg-neon-green text-background font-bold rounded-sm hover:bg-neon-green/80 transition-colors flex items-center justify-center gap-2 neon-glow-green"
                  >
                    <CheckCircle className="w-5 h-5" />
                    အတည်ပြုရန်
                  </button>
                  <button
                    onClick={() => handleIterate(selectedDesignData.id)}
                    className="py-3 px-4 bg-neon-cyan text-background font-bold rounded-sm hover:bg-neon-cyan/80 transition-colors flex items-center justify-center gap-2 neon-glow-cyan"
                  >
                    <RefreshCw className="w-5 h-5" />
                    ပြုပြင်ရန်
                  </button>
                  <button
                    onClick={() => handleReject(selectedDesignData.id)}
                    className="py-3 px-4 bg-neon-red text-background font-bold rounded-sm hover:bg-neon-red/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    ပယ်ဖျက်ရန်
                  </button>
                </div>
              </div>

              {/* Current Status */}
              <div className={`border rounded-sm p-4 ${
                selectedDesignData.status === 'pending' ? 'border-neon-yellow bg-neon-yellow/10' :
                selectedDesignData.status === 'approved' ? 'border-neon-green bg-neon-green/10' :
                selectedDesignData.status === 'rejected' ? 'border-neon-red bg-neon-red/10' :
                'border-neon-cyan bg-neon-cyan/10'
              }`}>
                <p className={`text-sm font-bold ${getStatusColor(selectedDesignData.status)}`}>
                  ▸ လက်ရှိ အခြေအနေ: {getStatusLabel(selectedDesignData.status)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">ဒီဇိုင်း မရှိပါ</p>
            </div>
          )}
        </div>

        {/* Design Queue */}
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <h3 className="text-xl font-bold neon-glow-pink mb-4">ပြန်လည်သုံးသပ်ရန် စာရင်း</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {designs.map((design) => (
              <button
                key={design.id}
                onClick={() => setSelectedDesign(design.id)}
                className={`w-full text-left px-3 py-3 rounded-sm border transition-all ${
                  selectedDesign === design.id
                    ? 'border-neon-pink bg-neon-pink/20'
                    : 'border-neon-border/30 hover:bg-background/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neon-cyan truncate">{design.title}</p>
                    <p className="text-xs text-muted-foreground">{design.timestamp}</p>
                  </div>
                  <span className={`text-xs font-bold flex-shrink-0 ${getStatusColor(design.status)}`}>
                    {getStatusLabel(design.status)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <h3 className="text-xl font-bold neon-glow-green mb-4">ပြန်လည်သုံးသပ်ခြင်း အကျဉ်းချုပ်</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-neon-yellow/30 rounded-sm p-4 bg-neon-yellow/5">
            <p className="text-neon-yellow font-bold text-lg">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">စောင့်ဆိုင်းနေသည့် ဒီဇိုင်းများ</p>
          </div>
          <div className="border border-neon-green/30 rounded-sm p-4 bg-neon-green/5">
            <p className="text-neon-green font-bold text-lg">{approvedCount}</p>
            <p className="text-xs text-muted-foreground">အတည်ပြုပြီးသော ဒီဇိုင်းများ</p>
          </div>
          <div className="border border-neon-red/30 rounded-sm p-4 bg-neon-red/5">
            <p className="text-neon-red font-bold text-lg">{rejectedCount}</p>
            <p className="text-xs text-muted-foreground">ပယ်ဖျက်ပြီးသော ဒီဇိုင်းများ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
