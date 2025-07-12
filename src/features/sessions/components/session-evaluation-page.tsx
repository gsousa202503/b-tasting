import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FlaskConical,
  FileText,
  Save,
  AlertTriangle,
  Eye,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TastingSession, Sample, SampleEvaluation, SampleSpecifications } from '@/types';
import { mockSessions } from '@/lib/mock-data';
import { loadingSimulation } from '@/lib/mock-delays';
import { toast } from 'sonner';
import { LottieLoader } from '@/components/ui/lottie-loader';

interface SessionEvaluationPageProps {
  sessionId: string;
}

export function SessionEvaluationPage({ sessionId }: SessionEvaluationPageProps) {
  const navigate = useNavigate();
  const [session, setSession] = useState<TastingSession | null>(null);
  const [evaluations, setEvaluations] = useState<SampleEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento da sessão
    const foundSession = mockSessions.find(s => s.id === sessionId);
    if (foundSession) {
      setSession(foundSession);
      // Inicializar avaliações com status padrão "conforme"
      const initialEvaluations: SampleEvaluation[] = foundSession.samples.map(sample => ({
        id: `eval-${sample.id}`,
        sampleId: sample.id,
        sessionId: sessionId,
        status: 'conforme',
        evaluatedBy: 'current-user',
        evaluatedAt: new Date().toISOString(),
      }));
      setEvaluations(initialEvaluations);
    }
    setLoading(false);
  }, [sessionId]);

  const updateEvaluation = (sampleId: string, updates: Partial<SampleEvaluation>) => {
    setEvaluations(prev => prev.map(evaluation => 
      evaluation.sampleId === sampleId 
        ? { ...evaluation, ...updates, evaluatedAt: new Date().toISOString() }
        : evaluation
    ));
  };

  const handleToggleCompliance = (sampleId: string, isCompliant: boolean) => {
    updateEvaluation(sampleId, {
      status: isCompliant ? 'conforme' : 'nao-conforme',
      comment: isCompliant ? undefined : evaluations.find(e => e.sampleId === sampleId)?.comment
    });
  };

  const handleCommentChange = (sampleId: string, comment: string) => {
    updateEvaluation(sampleId, { comment });
  };

  const handleMarkAllCompliant = () => {
    setEvaluations(prev => prev.map(evaluation => ({
      ...evaluation,
      status: 'conforme',
      comment: undefined,
      evaluatedAt: new Date().toISOString(),
    })));
    toast.success('Todas as amostras marcadas como conformes');
  };

  const handleMarkAllNonCompliant = () => {
    setEvaluations(prev => prev.map(evaluation => ({
      ...evaluation,
      status: 'nao-conforme',
      evaluatedAt: new Date().toISOString(),
    })));
    toast.success('Todas as amostras marcadas como não conformes');
  };

  const handleSaveEvaluations = () => {
    // Simulate saving with loading state
    const savePromise = loadingSimulation.sampleAnalysis().then(() => {
      toast.success('Avaliações salvas com sucesso!');
    });
    
    toast.promise(savePromise, {
      loading: 'Salvando avaliações...',
      success: 'Avaliações salvas com sucesso!',
      error: 'Erro ao salvar avaliações'
    });
  };

  const handleFinalizeSession = async () => {
    try {
      // Show loading state during finalization
      const finalizePromise = loadingSimulation.sessionEvaluation().then(() => {
        navigate({ to: '/sessions' });
      });
      
      toast.promise(finalizePromise, {
        loading: 'Finalizando sessão e gerando relatório...',
        success: 'Sessão finalizada com sucesso!',
        error: 'Erro ao finalizar sessão'
      });
      
      await finalizePromise;
    } catch (error) {
      console.error('Error finalizing session:', error);
    }
  };

  const getComplianceStats = () => {
    const compliant = evaluations.filter(e => e.status === 'conforme').length;
    const nonCompliant = evaluations.filter(e => e.status === 'nao-conforme').length;
    const total = evaluations.length;
    const percentage = total > 0 ? (compliant / total) * 100 : 0;

    return { compliant, nonCompliant, total, percentage };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beer-light via-background to-beer-light/50">
        <LottieLoader 
          size="xl" 
          variant="lab"
          text="Preparando interface de avaliação..."
        />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-beer-dark">Sessão não encontrada</h2>
          <p className="mt-2 text-muted-foreground">A sessão solicitada não existe ou foi removida.</p>
          <Button 
            onClick={() => navigate({ to: '/sessions' })}
            className="mt-4 bg-beer-medium hover:bg-beer-dark"
          >
            Voltar para Sessões
          </Button>
        </div>
      </div>
    );
  }

  const stats = getComplianceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-beer-light via-background to-beer-light/50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/sessions' })}
              className="text-beer-dark hover:bg-beer-light/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-beer-dark">{session.name}</h1>
              <p className="text-muted-foreground">
                {format(new Date(session.date), 'dd/MM/yyyy', { locale: ptBR })} às {session.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
              {session.status === 'active' ? 'Ativa' : 'Rascunho'}
            </Badge>
            <Badge variant={session.type === 'routine' ? 'default' : 'secondary'}>
              {session.type === 'routine' ? 'Rotina' : 'Extra'}
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-beer-medium/20 bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Amostras</CardTitle>
              <FlaskConical className="h-4 w-4 text-beer-medium" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-beer-dark">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-beer-medium/20 bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conformes</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.compliant}</div>
            </CardContent>
          </Card>

          <Card className="border-beer-medium/20 bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Não Conformes</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.nonCompliant}</div>
            </CardContent>
          </Card>

          <Card className="border-beer-medium/20 bg-white/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conformidade</CardTitle>
              <Eye className="h-4 w-4 text-beer-medium" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-beer-dark">{stats.percentage.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="evaluation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="evaluation">Avaliação das Amostras</TabsTrigger>
            <TabsTrigger value="specifications">Especificações</TabsTrigger>
          </TabsList>

          <TabsContent value="evaluation" className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-beer-medium/20 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-beer-dark">
                  <Settings className="h-5 w-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={handleMarkAllCompliant}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar Todas Conformes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleMarkAllNonCompliant}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Marcar Todas Não Conformes
                  </Button>
                  <Button
                    onClick={handleSaveEvaluations}
                    className="bg-beer-medium hover:bg-beer-dark"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Avaliações
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-beer-dark">Finalizar Sessão</h3>
                    <p className="text-sm text-muted-foreground">
                      Conclui a sessão e gera o relatório final
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Finalizar Sessão
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Finalizar Sessão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja finalizar esta sessão? Após a finalização, 
                          não será possível alterar as avaliações. Um relatório final será gerado.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleFinalizeSession}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Finalizar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            {/* Sample Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {session.samples.map((sample, index) => {
                const evaluation = evaluations.find(e => e.sampleId === sample.id);
                const isCompliant = evaluation?.status === 'conforme';

                return (
                  <Card 
                    key={sample.id} 
                    className={`border-2 transition-all duration-200 ${
                      isCompliant 
                        ? 'border-green-200 bg-green-50/50' 
                        : 'border-red-200 bg-red-50/50'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-beer-medium text-white text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-beer-dark">{sample.code}</CardTitle>
                            <p className="text-sm text-muted-foreground">{sample.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{sample.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Lote:</span> {sample.batch}
                        </div>
                        <div>
                          <span className="font-medium">Produção:</span>{' '}
                          {format(new Date(sample.productionDate), 'dd/MM/yyyy')}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`compliance-${sample.id}`} className="text-sm font-medium">
                            Status de Conformidade
                          </Label>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                              {isCompliant ? 'Conforme' : 'Não Conforme'}
                            </span>
                            <Switch
                              id={`compliance-${sample.id}`}
                              checked={isCompliant}
                              onCheckedChange={(checked) => handleToggleCompliance(sample.id, checked)}
                            />
                          </div>
                        </div>

                        {!isCompliant && (
                          <div className="space-y-2">
                            <Label htmlFor={`comment-${sample.id}`} className="text-sm font-medium">
                              Comentário sobre Não Conformidade
                            </Label>
                            <Textarea
                              id={`comment-${sample.id}`}
                              placeholder="Descreva o problema encontrado..."
                              value={evaluation?.comment || ''}
                              onChange={(e) => handleCommentChange(sample.id, e.target.value)}
                              rows={3}
                              className="text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-6">
            <Card className="border-beer-medium/20 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-beer-dark">
                  <FileText className="h-5 w-5" />
                  Especificações das Amostras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {session.samples.map((sample, index) => (
                    <div key={sample.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-beer-medium text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-beer-dark">{sample.code}</h3>
                          <p className="text-sm text-muted-foreground">{sample.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto">{sample.type}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="font-medium text-beer-dark">pH</span>
                          <p className="text-muted-foreground">4.2 ± 0.1</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-beer-dark">Cor (EBC)</span>
                          <p className="text-muted-foreground">12.5</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-beer-dark">Amargor (IBU)</span>
                          <p className="text-muted-foreground">25</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-beer-dark">Álcool (%)</span>
                          <p className="text-muted-foreground">5.2</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-beer-dark">Densidade</span>
                          <p className="text-muted-foreground">1.012</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-beer-dark">Temperatura (°C)</span>
                          <p className="text-muted-foreground">4-6</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-beer-dark">Clareza</span>
                          <p className="text-muted-foreground">Cristalina</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-beer-dark">Espuma</span>
                          <p className="text-muted-foreground">Persistente</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <span className="font-medium text-beer-dark">Características Sensoriais</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Aroma:</span>
                            <p className="text-muted-foreground">Floral, cítrico, malte</p>
                          </div>
                          <div>
                            <span className="font-medium">Sabor:</span>
                            <p className="text-muted-foreground">Equilibrado, refrescante</p>
                          </div>
                          <div>
                            <span className="font-medium">Corpo:</span>
                            <p className="text-muted-foreground">Médio</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}