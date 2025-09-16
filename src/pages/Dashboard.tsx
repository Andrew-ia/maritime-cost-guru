import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Calculator, Users, DollarSign, TrendingUp, Plus, 
  BarChart3, PieChart as PieChartIcon, Activity,
  Ship, FileText, Calendar
} from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';
import { ThemeToggle } from '@/components/ThemeToggle';

interface DashboardStats {
  totalCalculations: number;
  totalClients: number;
  calculationsThisMonth: number;
  totalValueProcessed: number;
  averageValue: number;
}

interface ChartData {
  name: string;
  value: number;
  count?: number;
}

const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCalculations: 0,
    totalClients: 0,
    calculationsThisMonth: 0,
    totalValueProcessed: 0,
    averageValue: 0
  });
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [incotermData, setIncotermData] = useState<ChartData[]>([]);
  const [clientData, setClientData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar estatísticas básicas
      const { data: calculations } = await supabase
        .from('calculations_history')
        .select('*');

      const { data: clients } = await supabase
        .from('clients')
        .select('*');

      if (calculations && clients) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const calculationsThisMonth = calculations.filter(calc => {
          const calcDate = new Date(calc.created_at);
          return calcDate.getMonth() === currentMonth && calcDate.getFullYear() === currentYear;
        }).length;

        const totalValueProcessed = calculations.reduce((sum, calc) => {
          return sum + (calc.calculation_data?.resultados?.custo_final || 0);
        }, 0);

        const averageValue = totalValueProcessed / (calculations.length || 1);

        setStats({
          totalCalculations: calculations.length,
          totalClients: clients.length,
          calculationsThisMonth,
          totalValueProcessed,
          averageValue
        });

        // Dados por mês (últimos 6 meses)
        const monthlyStats = getMonthlyStats(calculations);
        setMonthlyData(monthlyStats);

        // Dados por Incoterm
        const incotermStats = getIncotermStats(calculations);
        setIncotermData(incotermStats);

        // Top clientes
        const clientStats = getClientStats(calculations, clients);
        setClientData(clientStats);
      }
    } catch (error: any) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast({
        title: 'Erro ao carregar dashboard',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyStats = (calculations: any[]) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const currentMonth = new Date().getMonth();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const month = (currentMonth - i + 12) % 12;
      const monthName = months[month];
      
      const count = calculations.filter(calc => {
        const calcDate = new Date(calc.created_at);
        return calcDate.getMonth() === month;
      }).length;

      data.push({ name: monthName, value: count });
    }

    return data;
  };

  const getIncotermStats = (calculations: any[]) => {
    const incotermCount: { [key: string]: number } = {};
    
    calculations.forEach(calc => {
      const incoterm = calc.calculation_data?.dados?.incoterm || 'FOB';
      incotermCount[incoterm] = (incotermCount[incoterm] || 0) + 1;
    });

    return Object.entries(incotermCount).map(([name, value]) => ({ name, value }));
  };

  const getClientStats = (calculations: any[], clients: any[]) => {
    const clientCount: { [key: string]: number } = {};
    
    calculations.forEach(calc => {
      if (calc.client_id) {
        const client = clients.find(c => c.id === calc.client_id);
        if (client) {
          clientCount[client.name] = (clientCount[client.name] || 0) + 1;
        }
      }
    });

    return Object.entries(clientCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name: name.substring(0, 15) + '...', value }));
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <header className="bg-gradient-maritime shadow-elegant">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                  <Ship className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Maritime Cost Guru</h1>
                  <p className="text-white/80">Dashboard Analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle variant="ghost" className="text-white hover:bg-white/20" />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 animate-spin mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full"></div>
              <p className="text-muted-foreground">Carregando dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-maritime shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Maritime Cost Guru</h1>
                <p className="text-white/80">Dashboard Analytics</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Menu de Navegação Principal */}
              <nav className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/calculator')}
                  className="text-white hover:bg-white/20 gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Calculadora
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/calculations')}
                  className="text-white hover:bg-white/20 gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Cálculos
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/clients')}
                  className="text-white hover:bg-white/20 gap-2"
                >
                  <Users className="w-4 h-4" />
                  Clientes
                </Button>
              </nav>
              
              <ThemeToggle variant="ghost" className="text-white hover:bg-white/20" />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orçamentos</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCalculations}</div>
              <p className="text-xs text-muted-foreground">
                {stats.calculationsThisMonth} este mês
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                Clientes cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Processado</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalValueProcessed)}</div>
              <p className="text-xs text-muted-foreground">
                Total em orçamentos
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.averageValue)}</div>
              <p className="text-xs text-muted-foreground">
                Por orçamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/calculator')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Novo Cálculo</CardTitle>
                  <CardDescription>Calcular novo orçamento de importação</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/clients')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Gerenciar Clientes</CardTitle>
                  <CardDescription>Adicionar e editar informações de clientes</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/calculations')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Histórico</CardTitle>
                  <CardDescription>Ver cálculos salvos anteriormente</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Orçamentos por Mês */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle>Orçamentos por Mês</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Distribuição por Incoterm */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-primary" />
                <CardTitle>Distribuição por Incoterm</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incotermData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incotermData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Clientes */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <CardTitle>Top 5 Clientes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resumo Recente */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <CardTitle>Resumo do Mês</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Orçamentos criados</span>
                <Badge variant="secondary">{stats.calculationsThisMonth}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Valor médio</span>
                <Badge variant="secondary">{formatCurrency(stats.averageValue)}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Total clientes</span>
                <Badge variant="secondary">{stats.totalClients}</Badge>
              </div>
              <Separator />
              <div className="text-center">
                <Button variant="outline" size="sm" onClick={() => navigate('/calculations')}>
                  Ver Todos os Cálculos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}