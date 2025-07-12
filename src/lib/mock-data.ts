import { TastingSession, Sample, Taster } from '@/types';
import { addDays, format } from 'date-fns';

export const mockSamples: Sample[] = Array.from({ length: 50 }, (_, i) => ({
  id: `sample-${i + 1}`,
  code: `BT-${String(i + 1).padStart(4, '0')}`,
  description: `Amostra de Cerveja ${i + 1}`,
  productionDate: format(addDays(new Date(), -Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
  expirationDate: format(addDays(new Date(), Math.floor(Math.random() * 90)), 'yyyy-MM-dd'),
  batch: `L${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
  type: ['IPA', 'Lager', 'Pilsner', 'Weiss', 'Porter'][Math.floor(Math.random() * 5)],
  specifications: {
    ph: 4.0 + Math.random() * 1.0,
    color: Math.floor(Math.random() * 40) + 5,
    bitterness: Math.floor(Math.random() * 60) + 10,
    alcoholContent: 3.5 + Math.random() * 4.0,
    density: 1.008 + Math.random() * 0.020,
    temperature: 2 + Math.random() * 6,
    clarity: ['cristalina', 'turva', 'opaca'][Math.floor(Math.random() * 3)] as any,
    aroma: {
      intensity: Math.floor(Math.random() * 10) + 1,
      quality: Math.floor(Math.random() * 10) + 1,
      notes: 'Floral, cítrico, malte'
    },
    taste: {
      sweetness: Math.floor(Math.random() * 10) + 1,
      acidity: Math.floor(Math.random() * 10) + 1,
      bitterness: Math.floor(Math.random() * 10) + 1,
      body: Math.floor(Math.random() * 10) + 1,
    },
    appearance: {
      foam: Math.floor(Math.random() * 10) + 1,
      retention: Math.floor(Math.random() * 10) + 1,
      lacing: Math.floor(Math.random() * 10) + 1,
    }
  }
}));

export const mockTasters: Taster[] = [
  {
    id: 'taster-1',
    name: 'Ana Silva',
    email: 'ana.silva@brewery.com',
    department: 'Controle de Qualidade',
    isActive: true,
  },
  {
    id: 'taster-2',
    name: 'Carlos Santos',
    email: 'carlos.santos@brewery.com',
    department: 'Produção',
    isActive: true,
  },
  {
    id: 'taster-3',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@brewery.com',
    department: 'Laboratório',
    isActive: true,
  },
  {
    id: 'taster-4',
    name: 'João Pereira',
    email: 'joao.pereira@brewery.com',
    department: 'Controle de Qualidade',
    isActive: true,
  },
  {
    id: 'taster-5',
    name: 'Fernanda Costa',
    email: 'fernanda.costa@brewery.com',
    department: 'Produção',
    isActive: false,
  },
];

export const mockSessions: TastingSession[] = [
  {
    id: 'session-1',
    name: 'Sessão de Degustação - IPA Premium',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '14:00',
    type: 'routine',
    status: 'active',
    samples: mockSamples.slice(0, 5),
    tasters: mockTasters.slice(0, 3),
    observations: 'Análise de qualidade da nova receita de IPA.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'session-2',
    name: 'Teste de Estabilidade - Lager',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '10:30',
    type: 'extra',
    status: 'draft',
    samples: mockSamples.slice(5, 8),
    tasters: mockTasters.slice(0, 2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'session-3',
    name: 'Controle de Qualidade Semanal',
    date: format(addDays(new Date(), -2), 'yyyy-MM-dd'),
    time: '09:00',
    type: 'routine',
    status: 'completed',
    samples: mockSamples.slice(8, 12),
    tasters: mockTasters.slice(0, 4),
    observations: 'Sessão de controle de qualidade padrão.',
    createdAt: addDays(new Date(), -3).toISOString(),
    updatedAt: addDays(new Date(), -2).toISOString(),
  },
];