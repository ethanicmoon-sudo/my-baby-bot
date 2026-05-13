import { Microscope, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompetitorStore {
  id: string;
  name: string;
  revenue: number;
  products: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
  insights: string[];
}

interface ChartData {
  name: string;
  value: number;
  revenue?: number;
  products?: number;
}

export default function ResearchLab() {
  const [competitors, setCompetitors] = useState<CompetitorStore[]>([
    {
      id: '1',
      name: 'Creative Designs Co',
      revenue: 45000,
      products: 1250,
      rating: 4.8,
      trend: 'up',
      insights: [
        'T-Shirt ဒီဇိုင်းများ အများဆုံး ရောင်းအားကောင်း',
        'နေ့စဉ် ပြည့်ဝသော အမှာစာများ',
        'မူလ ဒီဇိုင်းများ အများအပြား',
      ],
    },
    {
      id: '2',
      name: 'Minimalist Art Store',
      revenue: 32000,
      products: 856,
      rating: 4.6,
      trend: 'stable',
      insights: [
        'အရိုးရှင်းသော ဒီဇိုင်း နည်းလမ်း',
        'မြင့်မားသော အဆင့်ခွဲခြခြင်း',
        'ကောင်းမွန်သော ဆက်သွယ်ရန် ဝန်ဆောင်မှု',
      ],
    },
    {
      id: '3',
      name: 'Vintage Vibes Studio',
      revenue: 28500,
      products: 742,
      rating: 4.5,
      trend: 'down',
      insights: [
        'အဟောင်း ပုံစံ ဒီဇိုင်းများ ရှာဖွေခြင်း',
        'အနည်းငယ် အမှာစာ ကျဆင်းခြင်း',
        'ယုံကြည်အားထားမှု အမြင့်',
      ],
    },
  ]);

  const [analysisData, setAnalysisData] = useState({
    totalAnalyzed: 847,
    topTrend: 'Neon Aesthetic ဒီဇိုင်းများ',
    avgRevenue: 35167,
    marketGrowth: '23% တစ်လတစ်ခါ',
  });

  // Prepare chart data
  const revenueChartData: ChartData[] = competitors.map(store => ({
    name: store.name.substring(0, 12),
    revenue: store.revenue / 1000,
    value: store.revenue,
  }));

  const productChartData: ChartData[] = competitors.map(store => ({
    name: store.name.substring(0, 12),
    products: store.products,
    value: store.products,
  }));

  const ratingChartData: ChartData[] = competitors.map(store => ({
    name: store.name.substring(0, 12),
    value: store.rating * 20, // Scale to 0-100
  }));

  const trendChartData = [
    { name: '📈 အပေါ်သို့', value: competitors.filter(c => c.trend === 'up').length },
    { name: '➡️ တည်ဆဲ', value: competitors.filter(c => c.trend === 'stable').length },
    { name: '📉 အောက်သို့', value: competitors.filter(c => c.trend === 'down').length },
  ];

  const COLORS = ['#ff006e', '#00d9ff', '#39ff14', '#ffd60a', '#ff006e'];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold neon-glow-green">သုတေသန ခန်း</h1>
        <p className="text-neon-cyan">Etsy ဆိုင် ခွဲခြမ်းစိတ်ဖြာမှု နှင့် အဆိုပြုချက်များ</p>
      </div>

      {/* Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">ခွဲခြမ်းစိတ်ဖြာခဲ့သော ဆိုင်များ</p>
          <p className="text-3xl font-bold text-neon-cyan">{analysisData.totalAnalyzed}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">အများဆုံး လှုပ်ရှားမှု</p>
          <p className="text-lg font-bold text-neon-pink">{analysisData.topTrend}</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">ပျမ်းမျှ ဝင်ငွေ</p>
          <p className="text-3xl font-bold text-neon-green">${(analysisData.avgRevenue / 1000).toFixed(1)}K</p>
        </div>
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <p className="text-xs text-muted-foreground mb-2">စျေးကွက် ကြီးထွားမှု</p>
          <p className="text-3xl font-bold text-neon-purple">{analysisData.marketGrowth}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <h3 className="text-xl font-bold neon-glow-cyan mb-6">ဝင်ငွေ ခွဲခြမ်းစိတ်ဖြာမှု</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 0, 110, 0.1)" />
              <XAxis dataKey="name" stroke="#00d9ff" style={{ fontSize: '12px' }} />
              <YAxis stroke="#00d9ff" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #ff006e',
                  borderRadius: '4px',
                }}
                formatter={(value: any) => `$${value}K`}
              />
              <Bar dataKey="revenue" fill="#ff006e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Count Chart */}
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <h3 className="text-xl font-bold neon-glow-cyan mb-6">ပစ္စည်း ရေတွက်မှု</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
              <XAxis dataKey="name" stroke="#00d9ff" style={{ fontSize: '12px' }} />
              <YAxis stroke="#00d9ff" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #00d9ff',
                  borderRadius: '4px',
                }}
              />
              <Line
                type="monotone"
                dataKey="products"
                stroke="#00d9ff"
                strokeWidth={2}
                dot={{ fill: '#ff006e', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Chart */}
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <h3 className="text-xl font-bold neon-glow-cyan mb-6">အဆင့်ခွဲခြခြင်း ယှဉ်ပြိုင်မှု</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(57, 255, 20, 0.1)" />
              <XAxis dataKey="name" stroke="#39ff14" style={{ fontSize: '12px' }} />
              <YAxis stroke="#39ff14" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #39ff14',
                  borderRadius: '4px',
                }}
                formatter={(value: any) => `${((value as number) / 20).toFixed(1)}/5.0`}
              />
              <Bar dataKey="value" fill="#39ff14" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Distribution Pie Chart */}
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <h3 className="text-xl font-bold neon-glow-cyan mb-6">လှုပ်ရှားမှု ဖြန့်ဝေမှု</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trendChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trendChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid #ff006e',
                  borderRadius: '4px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competitor Analysis Table */}
      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border overflow-x-auto">
        <h2 className="text-2xl font-bold neon-glow-cyan mb-6">ပြိုင်ဆိုင်သူ ခွဲခြမ်းစိတ်ဖြာမှု</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neon-border/30">
              <th className="text-left py-3 px-4 text-neon-cyan font-bold">ဆိုင် အမည်</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-bold">ဝင်ငွေ</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-bold">ပစ္စည်းများ</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-bold">အဆင့်</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-bold">လှုပ်ရှားမှု</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((store) => (
              <tr key={store.id} className="border-b border-neon-border/20 hover:bg-background/50 transition-colors">
                <td className="py-4 px-4 text-foreground">{store.name}</td>
                <td className="py-4 px-4 text-neon-green font-bold">${(store.revenue / 1000).toFixed(1)}K</td>
                <td className="py-4 px-4 text-neon-cyan">{store.products}</td>
                <td className="py-4 px-4">
                  <span className="text-neon-yellow font-bold">{store.rating}/5.0</span>
                </td>
                <td className="py-4 px-4 text-2xl">{getTrendIcon(store.trend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitor Insights */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold neon-glow-pink">အဆိုပြုချက်များ နှင့် အဆင့်မြှင့်တင်မှုများ</h2>

        {competitors.map((store) => (
          <div key={store.id} className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-neon-cyan">{store.name}</h3>
              <span className="text-2xl">{getTrendIcon(store.trend)}</span>
            </div>

            <div className="space-y-2">
              {store.insights.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-neon-pink rounded-full mt-2 flex-shrink-0" />
                  <p className="text-foreground text-sm">{insight}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-neon-purple/10 border border-neon-purple/30 rounded-sm">
              <p className="text-xs text-neon-purple">
                💡 အကြံပြုချက်: ဤဆိုင်၏ ဒီဇိုင်း သုံးအုပ်စုများကို ကူးယူ၍ သင်၏ အုပ်စုများတွင် ပေါင်းထည့်ပါ
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button className="w-full py-4 px-6 bg-neon-green text-background font-bold rounded-sm hover:bg-neon-green/80 transition-colors neon-glow-green text-lg flex items-center justify-center gap-2">
        <BarChart3 className="w-5 h-5" />
        အသစ် သုတေသန စတင်ရန်
      </button>
    </div>
  );
}
