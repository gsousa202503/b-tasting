import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Settings } from 'lucide-react';
import { SessionFormData } from '@/types';

interface SessionDataStepProps {
  data: SessionFormData['sessionData'];
  onChange: (data: SessionFormData['sessionData']) => void;
}

export function SessionDataStep({ data, onChange }: SessionDataStepProps) {
  const updateField = (field: keyof SessionFormData['sessionData'], value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-beer-dark">
            <Settings className="h-5 w-5" />
            Informações Básicas da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-name">Nome da Sessão *</Label>
            <Input
              id="session-name"
              placeholder="Ex: Controle de Qualidade Semanal"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-date">Data da Sessão *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="session-date"
                  type="date"
                  className="pl-10"
                  value={data.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-time">Horário da Sessão *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="session-time"
                  type="time"
                  className="pl-10"
                  value={data.time}
                  onChange={(e) => updateField('time', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-type">Tipo de Sessão *</Label>
            <Select value={data.type} onValueChange={(value: 'routine' | 'extra') => updateField('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Rotina</SelectItem>
                <SelectItem value="extra">Extra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-beer-dark">Filtros para Busca de Amostras (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Data de Produção - Início</Label>
              <Input
                id="start-date"
                type="date"
                value={data.startDate || ''}
                onChange={(e) => updateField('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">Data de Produção - Fim</Label>
              <Input
                id="end-date"
                type="date"
                value={data.endDate || ''}
                onChange={(e) => updateField('endDate', e.target.value)}
              />
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Estes filtros serão aplicados na busca de amostras no próximo passo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}