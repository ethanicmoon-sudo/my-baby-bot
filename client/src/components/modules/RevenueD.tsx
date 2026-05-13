import { AlertTriangle, Award, DollarSign, ShieldCheck, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';

interface RevenueMetric {
  id: string;
  source: string;
  revenue: number;
  orders: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

interface ProductPerformance {
  id: string;
  name: string;
  revenue: number;
  units: number;
  rating: number;
}

export default function RevenueD() {
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetric[]>([
    {
      id: '1',
      source: 'Etsy',
      revenue: 7000,
      orders: 156,
      trend: 'up',
      percentage: 12,
    },
    {
      id: '2',
      source: 'Fiverr',
      revenue: 2000,
      orders: 34,
      trend: 'up',
      percentage: 8,
    },
    {
      id: '3',
      source: 'Supplement Store',
      revenue: 1500,
      orders: 28,
      trend: 'stable',
      percentage: 0,
    },
  ]);

  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([
    {
      id: '1',
      name: 'Neon Aesthetic T-Shirt',
      revenue: 3200,
      units: 145,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Cyberpunk Mug',
      revenue: 1800,
      units: 89,
      rating: 4.6,
    },
    {
      id: '3',
      name: 'Minimalist Poster',
      revenue: 1200,
      units: 67,
      rating: 4.5,
    },
    {
      id: '4',
      name: 'Retro Gaming Design Hoodie',
      revenue: 800,
      units: 32,
      rating: 4.7,
    },
  ]);

  const totalRevenue = revenueMetrics.reduce((sum, m) => sum + m.revenue, 0);
  const totalOrders = revenueMetrics.reduce((sum, m) => sum + m.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);
  const binanceStatus = trpc.wallet.binanceStatus.useQuery();
  const withdrawalHistory = trpc.wallet.withdrawalHistory.useQuery();
  const withdrawMutation = trpc.wallet.withdrawToBinance.useMutation();
  const [withdrawForm, setWithdrawForm] = useState({
    coin: 'USDT',
    network: 'TRX',
    address: '',
    addressTag: '',
    amount: '',
    walletType: 'spot' as 'spot' | 'funding',
    confirmationText: '',
  });

  const expectedConfirmation = withdrawForm.amount
    ? `WITHDRAW ${withdrawForm.amount} ${withdrawForm.coin.toUpperCase()}`
    : 'WITHDRAW amount COIN';

  const updateWithdrawForm = (field: keyof typeof withdrawForm, value: string) => {
    setWithdrawForm(prev => ({ ...prev, [field]: value }));
  };

  const submitWithdrawal = () => {
    withdrawMutation.mutate(withdrawForm);
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-neon-green';
    if (trend === 'down') return 'text-neon-red';
    return 'text-neon-yellow';
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold neon-glow-purple">ဝင်ငွေ ဒက်ရှ်ဘုတ်</h1>
        <p className="text-neon-cyan">ဝင်ငွေ, အမှာစာများ, နှင့် ပစ္စည်း လုပ်ဆောင်ချက် မက်ထရစ်</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">စုစုပေါင်း ဝင်ငွေ</p>
            <DollarSign className="w-5 h-5 text-neon-green" />
          </div>
          <p className="text-3xl font-bold text-neon-green">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-neon-green mt-2">✓ ဤလ အတွင်း</p>
        </div>

        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">စုစုပေါင်း အမှာစာများ</p>
            <ShoppingCart className="w-5 h-5 text-neon-cyan" />
          </div>
          <p className="text-3xl font-bold text-neon-cyan">{totalOrders}</p>
          <p className="text-xs text-neon-cyan mt-2">✓ လုံးလုံးလျားလျား</p>
        </div>

        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">ပျမ်းမျှ အမှာစာ တန်ဖိုး</p>
            <Award className="w-5 h-5 text-neon-pink" />
          </div>
          <p className="text-3xl font-bold text-neon-pink">${avgOrderValue}</p>
          <p className="text-xs text-neon-pink mt-2">✓ အမှာစာတစ်ခုစီ</p>
        </div>

        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground">ဝင်ငွေ ကြီးထွားမှု</p>
            <TrendingUp className="w-5 h-5 text-neon-purple" />
          </div>
          <p className="text-3xl font-bold text-neon-purple">+18%</p>
          <p className="text-xs text-neon-purple mt-2">✓ ပြီးခဲ့သည့် လ နှင့် နှိုင်းယှဉ်</p>
        </div>
      </div>

      {/* Revenue by Source */}
      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <h2 className="text-2xl font-bold neon-glow-cyan mb-6">အရင်းအမြစ်အလိုက် ဝင်ငွေ</h2>
        
        <div className="space-y-4">
          {revenueMetrics.map((metric) => (
            <div key={metric.id} className="border border-neon-border/30 rounded-sm p-4 bg-background/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTrendIcon(metric.trend)}</span>
                  <div>
                    <h3 className="font-bold text-neon-cyan">{metric.source}</h3>
                    <p className="text-xs text-muted-foreground">{metric.orders} အမှာစာများ</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neon-green">${metric.revenue.toLocaleString()}</p>
                  <p className={`text-xs font-bold ${getTrendColor(metric.trend)}`}>
                    {metric.trend === 'up' && '+'}
                    {metric.trend === 'down' && '-'}
                    {metric.percentage}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-background border border-neon-border/20 rounded-sm h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan"
                  style={{ width: `${(metric.revenue / 7000) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Wallet className="h-6 w-6 text-neon-green" />
              <h2 className="text-2xl font-bold neon-glow-green">Binance Withdrawal</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Server-side signed withdrawal with address allowlist, confirmation phrase, and audit log.
            </p>
          </div>
          <div className="grid gap-2 text-xs sm:grid-cols-3">
            <span className={`rounded-sm border px-3 py-2 ${binanceStatus.data?.configured ? 'border-neon-green text-neon-green' : 'border-neon-red text-neon-red'}`}>
              API {binanceStatus.data?.configured ? 'configured' : 'missing'}
            </span>
            <span className={`rounded-sm border px-3 py-2 ${binanceStatus.data?.enabled ? 'border-neon-green text-neon-green' : 'border-neon-yellow text-neon-yellow'}`}>
              Withdrawals {binanceStatus.data?.enabled ? 'enabled' : 'locked'}
            </span>
            <span className="rounded-sm border border-neon-border px-3 py-2 text-neon-cyan">
              Allowlist {binanceStatus.data?.allowedAddressCount ?? 0}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-6">
          <div className="space-y-2 lg:col-span-1">
            <label className="text-xs font-bold text-neon-cyan">Coin</label>
            <Input value={withdrawForm.coin} onChange={event => updateWithdrawForm('coin', event.target.value.toUpperCase())} />
          </div>
          <div className="space-y-2 lg:col-span-1">
            <label className="text-xs font-bold text-neon-cyan">Network</label>
            <Input value={withdrawForm.network} onChange={event => updateWithdrawForm('network', event.target.value.toUpperCase())} />
          </div>
          <div className="space-y-2 lg:col-span-1">
            <label className="text-xs font-bold text-neon-cyan">Amount</label>
            <Input inputMode="decimal" value={withdrawForm.amount} onChange={event => updateWithdrawForm('amount', event.target.value)} />
          </div>
          <div className="space-y-2 lg:col-span-1">
            <label className="text-xs font-bold text-neon-cyan">Wallet</label>
            <Select value={withdrawForm.walletType} onValueChange={value => updateWithdrawForm('walletType', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spot">Spot</SelectItem>
                <SelectItem value="funding">Funding</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-xs font-bold text-neon-cyan">Address tag / memo</label>
            <Input value={withdrawForm.addressTag} onChange={event => updateWithdrawForm('addressTag', event.target.value)} />
          </div>
          <div className="space-y-2 lg:col-span-4">
            <label className="text-xs font-bold text-neon-cyan">Destination address</label>
            <Input value={withdrawForm.address} onChange={event => updateWithdrawForm('address', event.target.value)} />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-xs font-bold text-neon-cyan">Confirmation phrase</label>
            <Input
              placeholder={expectedConfirmation}
              value={withdrawForm.confirmationText}
              onChange={event => updateWithdrawForm('confirmationText', event.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-neon-border/30 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-neon-green" />
            <span>Type <span className="font-bold text-foreground">{expectedConfirmation}</span> to unlock the final server request.</span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={withdrawMutation.isPending || withdrawForm.confirmationText !== expectedConfirmation}
              >
                <AlertTriangle className="h-4 w-4" />
                Submit withdrawal
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm real Binance withdrawal</AlertDialogTitle>
                <AlertDialogDescription>
                  This sends a signed request from the server to Binance for {withdrawForm.amount || '0'} {withdrawForm.coin.toUpperCase()} on {withdrawForm.network || 'default'} network.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={submitWithdrawal}>Send to Binance</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {withdrawMutation.isError && (
          <p className="mt-4 rounded-sm border border-neon-red/60 p-3 text-sm text-neon-red">
            {withdrawMutation.error.message}
          </p>
        )}
        {withdrawMutation.isSuccess && (
          <p className="mt-4 rounded-sm border border-neon-green/60 p-3 text-sm text-neon-green">
            Submitted. Binance id: {withdrawMutation.data.providerWithdrawalId}
          </p>
        )}
      </div>

      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
        <h2 className="text-2xl font-bold neon-glow-cyan mb-6">Recent Withdrawal Transactions</h2>
        {withdrawalHistory.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        ) : withdrawalHistory.data && withdrawalHistory.data.length > 0 ? (
          <div className="space-y-3">
            {withdrawalHistory.data.map(item => (
              <div key={item.id} className="border border-neon-border/30 rounded-sm p-4 bg-background/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-neon-cyan font-bold">
                    {item.amount} {item.coin}
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-sm ${
                      item.status === "submitted"
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-neon-red/20 text-neon-red"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground break-all">
                  Order: {item.withdrawOrderId}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                {item.errorMessage && (
                  <p className="mt-2 text-xs text-neon-red">{item.errorMessage}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No withdrawal transactions yet.</p>
        )}
      </div>

      {/* Top Products */}
      <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border overflow-x-auto">
        <h2 className="text-2xl font-bold neon-glow-green mb-6">အများဆုံး ရောင်းအားကောင်း ပစ္စည်းများ</h2>
        
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neon-border/30">
              <th className="text-left py-3 px-4 text-neon-cyan font-bold">ပစ္စည်း အမည်</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-bold">ဝင်ငွေ</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-bold">ယူနစ်များ</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-bold">အဆင့်</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product) => (
              <tr key={product.id} className="border-b border-neon-border/20 hover:bg-background/50 transition-colors">
                <td className="py-4 px-4 text-foreground">{product.name}</td>
                <td className="py-4 px-4 text-neon-green font-bold">${product.revenue.toLocaleString()}</td>
                <td className="py-4 px-4 text-neon-cyan">{product.units}</td>
                <td className="py-4 px-4">
                  <span className="text-neon-yellow font-bold">{product.rating}/5.0</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <h3 className="text-xl font-bold neon-glow-pink mb-4">လုပ်ဆောင်ချက် အကျဉ်းချုပ်</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground">အများဆုံး ရောင်းအားကောင်း ပစ္စည်း</span>
              <span className="font-bold text-neon-cyan">Neon T-Shirt</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">အများဆုံး အမှာစာများ</span>
              <span className="font-bold text-neon-green">Etsy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">ပျမ်းမျှ အဆင့်</span>
              <span className="font-bold text-neon-yellow">4.65/5.0</span>
            </div>
          </div>
        </div>

        <div className="border border-neon-border rounded-sm p-6 bg-card/50 neon-border">
          <h3 className="text-xl font-bold neon-glow-purple mb-4">ရည်မှန်းချက်များ</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">ဝင်ငွေ ရည်မှန်းချက် ($10K)</span>
                <span className="text-sm font-bold text-neon-green">70%</span>
              </div>
              <div className="w-full bg-background border border-neon-border/20 rounded-sm h-2 overflow-hidden">
                <div className="h-full bg-neon-green" style={{ width: '70%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">အမှာစာ ရည်မှန်းချက် (250)</span>
                <span className="text-sm font-bold text-neon-cyan">64%</span>
              </div>
              <div className="w-full bg-background border border-neon-border/20 rounded-sm h-2 overflow-hidden">
                <div className="h-full bg-neon-cyan" style={{ width: '64%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
