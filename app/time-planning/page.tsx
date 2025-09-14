'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, Trash2, Save, User, Brain, Edit3, Clock, CheckCircle, Users, FileText, TrendingUp, Award, Settings, Phone, MapPin, Bell, Star, Target, Zap, Coffee, ArrowRight, Home } from 'lucide-react'
import Image from 'next/image'

// ============================================================================
// 1. INTERFACES E TIPOS DE DADOS
// ============================================================================

// Tipos para Gestão de Pacientes
interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: 'TEA' | 'TDAH' | 'TEA+TDAH' | 'Outro';
  severity: 'Leve' | 'Moderado' | 'Severo';
  guardian: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: Date;
  lastSession: Date | null;
  nextSession: Date | null;
  ludiTeaConnected: boolean;
  sessionsCount: number;
}

interface Appointment {
  id: string;
  patientId: string;
  type: 'avaliacao' | 'terapia' | 'followup' | 'familiar' | 'relatorio';
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'agendado' | 'concluido' | 'cancelado' | 'remarcado';
  notes: string;
  materials: string[];
}

// Tipos para Planejamento de Tempo
interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'personal' | 'health' | 'family' | 'learning' | 'rest' | 'routine';
  priority: 'high' | 'medium' | 'low';
  color: string;
  completed?: boolean;
}

interface DaySchedule {
  date: string;
  dayName: string;
  blocks: TimeBlock[];
}

interface WeekPlan {
  id: string;
  title: string;
  days: DaySchedule[];
  goals: string[];
  createdAt: Date;
}

interface Template {
  name: string;
  description: string;
  icon: string;
  defaultBlocks: Omit<TimeBlock, 'id' | 'color'>[];
}

// ============================================================================
// 2. DADOS E CONFIGURAÇÕES
// ============================================================================

const appointmentTypes = [
  { id: 'avaliacao', name: 'Avaliação Inicial', duration: 90, color: '#EF4444', icon: '📋' },
  { id: 'terapia', name: 'Sessão Terapêutica', duration: 60, color: '#10B981', icon: '🧠' },
  { id: 'followup', name: 'Follow-up', duration: 45, color: '#3B82F6', icon: '🔄' },
  { id: 'familiar', name: 'Orientação Familiar', duration: 60, color: '#8B5CF6', icon: '👨‍👩‍👧‍👦' },
  { id: 'relatorio', name: 'Elaboração Relatório', duration: 30, color: '#F59E0B', icon: '📄' }
];

const diagnosisColors = {
  'TEA': '#3B82F6',
  'TDAH': '#EF4444', 
  'TEA+TDAH': '#8B5CF6',
  'Outro': '#6B7280'
};

const categories = [
  { id: 'work', name: 'Trabalho', color: '#3B82F6', icon: '💼' },
  { id: 'personal', name: 'Pessoal', color: '#10B981', icon: '🏠' },
  { id: 'health', name: 'Saúde', color: '#EF4444', icon: '🏃' },
  { id: 'family', name: 'Família', color: '#8B5CF6', icon: '👨‍👩‍👧‍👦' },
  { id: 'learning', name: 'Aprendizado', color: '#F59E0B', icon: '📚' },
  { id: 'rest', name: 'Descanso', color: '#6B7280', icon: '😴' },
  { id: 'routine', name: 'Rotina', color: '#EC4899', icon: '🔄' }
] as const;

const templates: Template[] = [
  {
    name: 'Rotina Familiar TEA',
    description: 'Estrutura pensada para famílias com crianças TEA',
    icon: '👨‍👩‍👧‍👦',
    defaultBlocks: [
      { title: 'Rotina Matinal Estruturada', startTime: '07:00', endTime: '08:30', category: 'routine', priority: 'high' },
      { title: 'Atividades Educativas', startTime: '09:00', endTime: '11:00', category: 'learning', priority: 'high' },
      { title: 'Intervalo Sensorial', startTime: '11:00', endTime: '11:30', category: 'health', priority: 'medium' },
      { title: 'Tempo de Qualidade', startTime: '16:00', endTime: '17:30', category: 'family', priority: 'high' },
      { title: 'Rotina Noturna', startTime: '19:30', endTime: '21:00', category: 'routine', priority: 'high' }
    ]
  },
  {
    name: 'Cuidador Organizado',
    description: 'Para cuidadores que precisam equilibrar múltiplas tarefas',
    icon: '💪',
    defaultBlocks: [
      { title: 'Preparação do Dia', startTime: '06:30', endTime: '07:30', category: 'routine', priority: 'high' },
      { title: 'Cuidados Principais', startTime: '08:00', endTime: '12:00', category: 'family', priority: 'high' },
      { title: 'Pausa Pessoal', startTime: '12:00', endTime: '13:00', category: 'personal', priority: 'medium' },
      { title: 'Atividades Terapêuticas', startTime: '14:00', endTime: '16:00', category: 'health', priority: 'high' },
      { title: 'Autocuidado', startTime: '20:00', endTime: '21:00', category: 'personal', priority: 'medium' }
    ]
  }
];

const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// ============================================================================
// 3. COMPONENTE HEADER PRINCIPAL
// ============================================================================
const MainHeader = ({ currentSection, onNavigate }) => (
  <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white sticky top-0 z-20 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16 sm:h-20">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg p-1 flex items-center justify-center">
            <span className="text-xl sm:text-2xl">🧩</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl sm:text-2xl font-bold">LudiTEA</h1>
            <p className="text-xs sm:text-sm text-purple-200">Gestão Integrada</p>
          </div>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {currentSection !== 'home' && (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </button>
          )}
          <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
            FOUNDER FREE
          </div>
        </div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 4. COMPONENTE HOME/SELEÇÃO
// ============================================================================
const HomeSection = ({ onSelectModule }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
          <span className="text-4xl sm:text-6xl">🧩</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4">
          Bem-vindo ao <span className="text-purple-600">LudiTEA</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Plataforma integrada para gestão de pacientes TEA/TDAH e planejamento de tempo estruturado
        </p>
      </div>

      {/* Módulos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
        
        {/* Gestão de Pacientes */}
        <div className="group">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 border border-gray-100 group-hover:border-purple-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">LudiTEA Desk</h2>
              <p className="text-gray-600 text-sm sm:text-base">Gestão Clínica Profissional</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">Controle completo de pacientes e consultas</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">Agenda inteligente e relatórios detalhados</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">Integração com análises de IA</p>
              </div>
            </div>

            <button
              onClick={() => onSelectModule('patients')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <span className="text-sm sm:text-base">Acessar Gestão de Pacientes</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Planejamento de Tempo */}
        <div className="group">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 border border-gray-100 group-hover:border-green-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Planejamento de Tempo</h2>
              <p className="text-gray-600 text-sm sm:text-base">Organização Familiar Estruturada</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">Templates personalizados para rotinas TEA</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">Cronogramas visuais e gamificação</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-gray-700">Ideal para famílias e cuidadores</p>
              </div>
            </div>

            <button
              onClick={() => onSelectModule('planning')}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <span className="text-sm sm:text-base">Acessar Planejamento</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Adicionais */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center border border-white/20">
          <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Gestão Completa</h3>
          <p className="text-xs sm:text-sm text-gray-600">Pacientes, consultas e relatórios</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center border border-white/20">
          <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Rotinas Estruturadas</h3>
          <p className="text-xs sm:text-sm text-gray-600">Templates especializados</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center border border-white/20">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Análises IA</h3>
          <p className="text-xs sm:text-sm text-gray-600">Insights inteligentes</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 text-center border border-white/20">
          <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Founder Free</h3>
          <p className="text-xs sm:text-sm text-gray-600">Acesso vitalício completo</p>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// 5. COMPONENTE GESTÃO DE PACIENTES (OTIMIZADO MOBILE)
// ============================================================================
const PatientsModule = ({ onNavigate }) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'patients' | 'calendar' | 'reports'>('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '',
    age: 0,
    diagnosis: 'TEA',
    severity: 'Moderado',
    guardian: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    ludiTeaConnected: false
  });

  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    type: 'terapia',
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
    materials: []
  });

  // Dados mockados
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'Ana Clara Silva',
        age: 7,
        diagnosis: 'TEA',
        severity: 'Moderado',
        guardian: 'Maria Silva',
        phone: '(11) 99999-0001',
        email: 'maria.silva@email.com',
        address: 'Rua das Flores, 123',
        notes: 'Criança comunicativa, gosta de rotinas estruturadas',
        createdAt: new Date('2024-01-15'),
        lastSession: new Date('2024-09-10'),
        nextSession: new Date('2024-09-17'),
        ludiTeaConnected: true,
        sessionsCount: 24
      },
      {
        id: '2', 
        name: 'Pedro Oliveira',
        age: 9,
        diagnosis: 'TDAH',
        severity: 'Severo',
        guardian: 'João Oliveira',
        phone: '(11) 99999-0002',
        email: 'joao.oliveira@email.com',
        address: 'Av. Principal, 456',
        notes: 'Dificuldade de concentração, responde bem a reforços visuais',
        createdAt: new Date('2024-02-20'),
        lastSession: new Date('2024-09-12'),
        nextSession: new Date('2024-09-19'),
        ludiTeaConnected: false,
        sessionsCount: 18
      }
    ];

    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientId: '1',
        type: 'terapia',
        title: 'Terapia - Ana Clara',
        date: '2024-09-17',
        startTime: '14:00',
        endTime: '15:00',
        status: 'agendado',
        notes: 'Focar em habilidades sociais',
        materials: ['Cartões de emoções', 'Jogos cooperativos']
      }
    ];

    setPatients(mockPatients);
    setAppointments(mockAppointments);
  }, []);

  const addPatient = () => {
    if (!newPatient.name) return;

    const patient: Patient = {
      id: Date.now().toString(),
      name: newPatient.name,
      age: newPatient.age || 0,
      diagnosis: newPatient.diagnosis || 'TEA',
      severity: newPatient.severity || 'Moderado',
      guardian: newPatient.guardian || '',
      phone: newPatient.phone || '',
      email: newPatient.email || '',
      address: newPatient.address || '',
      notes: newPatient.notes || '',
      createdAt: new Date(),
      lastSession: null,
      nextSession: null,
      ludiTeaConnected: newPatient.ludiTeaConnected || false,
      sessionsCount: 0
    };

    setPatients(prev => [...prev, patient]);
    setNewPatient({
      name: '',
      age: 0,
      diagnosis: 'TEA',
      severity: 'Moderado',
      guardian: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      ludiTeaConnected: false
    });
    setIsAddingPatient(false);
  };

  const getDashboardStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return aptDate >= weekStart;
    });

    return {
      totalPatients: patients.length,
      todayAppointments: appointments.filter(apt => apt.date === today).length,
      weekAppointments: thisWeek.length,
      ludiTeaConnected: patients.filter(p => p.ludiTeaConnected).length,
      pendingReports: appointments.filter(apt => apt.type === 'relatorio' && apt.status === 'agendado').length
    };
  };

  const stats = getDashboardStats();

  // Mobile Navigation
  const MobileNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-4 gap-1">
        {[
          { id: 'dashboard', name: 'Início', icon: TrendingUp },
          { id: 'patients', name: 'Pacientes', icon: Users },
          { id: 'calendar', name: 'Agenda', icon: Calendar },
          { id: 'reports', name: 'Relatórios', icon: FileText }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as any)}
            className={`p-3 text-center ${
              currentView === item.id 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-500'
            }`}
          >
            <item.icon className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200 min-h-[calc(100vh-5rem)] p-4">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'patients', name: 'Pacientes', icon: Users },
              { id: 'calendar', name: 'Agenda', icon: Calendar },
              { id: 'reports', name: 'Relatórios', icon: FileText }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentView === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {currentView === 'dashboard' && (
            <div className="space-y-4 lg:space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-600">Pacientes</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                    </div>
                    <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-600">Hoje</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                    </div>
                    <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-600">LudiTEA</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.ludiTeaConnected}</p>
                    </div>
                    <Brain className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-gray-600">Relatórios</p>
                      <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
                    </div>
                    <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Ações Rápidas</h3>
                  <div className="space-y-2 lg:space-y-3">
                    <button 
                      onClick={() => {setCurrentView('calendar'); setIsAddingAppointment(true);}}
                      className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
                    >
                      Nova Consulta
                    </button>
                    <button 
                      onClick={() => {setCurrentView('patients'); setIsAddingPatient(true);}}
                      className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm lg:text-base"
                    >
                      Novo Paciente
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Pacientes Recentes</h3>
                  <div className="space-y-2 lg:space-y-3">
                    {patients.slice(0, 3).map(patient => (
                      <div key={patient.id} className="flex items-center gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg">
                        <div 
                          className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm"
                          style={{ backgroundColor: diagnosisColors[patient.diagnosis] }}
                        >
                          {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{patient.name}</p>
                          <p className="text-xs lg:text-sm text-gray-600">{patient.diagnosis} • {patient.age} anos</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'patients' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Pacientes</h2>
                <button
                  onClick={() => setIsAddingPatient(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm lg:text-base"
                >
                  <Plus className="w-4 h-4" />
                  Novo Paciente
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {patients.map(patient => (
                  <div key={patient.id} className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-3 lg:mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base"
                          style={{ backgroundColor: diagnosisColors[patient.diagnosis] }}
                        >
                          {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm lg:text-base">{patient.name}</h3>
                          <p className="text-xs lg:text-sm text-gray-600">{patient.age} anos</p>
                        </div>
                      </div>
                      {patient.ludiTeaConnected && (
                        <Brain className="w-4 h-4 lg:w-5 lg:h-5 text-purple-500" />
                      )}
                    </div>

                    <div className="space-y-2 mb-4 text-xs lg:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Diagnóstico:</span>
                        <span className="font-semibold">{patient.diagnosis}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Severidade:</span>
                        <span className={`font-semibold ${
                          patient.severity === 'Leve' ? 'text-green-600' :
                          patient.severity === 'Moderado' ? 'text-yellow-600' : 'text-red-600'
                        }`}>{patient.severity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sessões:</span>
                        <span className="font-semibold">{patient.sessionsCount}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPatient(patient)}
                      className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs lg:text-sm"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'calendar' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Agenda</h2>
                <button
                  onClick={() => setIsAddingAppointment(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm lg:text-base"
                >
                  <Plus className="w-4 h-4" />
                  Nova Consulta
                </button>
              </div>

              <div className="bg-white rounded-lg lg:rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
                />
                
                <div className="space-y-3">
                  {appointments.filter(apt => apt.date === selectedDate).map(apt => {
                    const patient = patients.find(p => p.id === apt.patientId);
                    const typeInfo = appointmentTypes.find(t => t.id === apt.type);
                    
                    return (
                      <div key={apt.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm lg:text-base">{patient?.name}</h4>
                            <p className="text-xs lg:text-sm text-gray-600">{apt.startTime} - {typeInfo?.name}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {appointments.filter(apt => apt.date === selectedDate).length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma consulta para este dia</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'reports' && (
            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Relatórios</h2>
              <div className="bg-white rounded-lg lg:rounded-xl p-6 lg:p-8 shadow-sm border border-gray-200 text-center">
                <FileText className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Relatórios em Desenvolvimento</h3>
                <p className="text-sm lg:text-base text-gray-600">Análises detalhadas e insights em breve.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <MobileNav />

      {/* Modais */}
      {isAddingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Novo Paciente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={newPatient.name || ''}
                  onChange={e => setNewPatient(prev => ({...prev, name: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade *</label>
                <input
                  type="number"
                  value={newPatient.age || ''}
                  onChange={e => setNewPatient(prev => ({...prev, age: parseInt(e.target.value)}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico *</label>
                <select
                  value={newPatient.diagnosis}
                  onChange={e => setNewPatient(prev => ({...prev, diagnosis: e.target.value as any}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TEA">TEA</option>
                  <option value="TDAH">TDAH</option>
                  <option value="TEA+TDAH">TEA + TDAH</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                <input
                  type="text"
                  value={newPatient.guardian || ''}
                  onChange={e => setNewPatient(prev => ({...prev, guardian: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={addPatient}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => setIsAddingPatient(false)}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 6. COMPONENTE PLANEJAMENTO DE TEMPO
// ============================================================================
const PlanningModule = ({ onNavigate }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentView, setCurrentView] = useState<'templates' | 'daily' | 'weekly' | 'analysis'>('templates');
  const [currentWeek, setCurrentWeek] = useState<WeekPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [score, setScore] = useState(0);
  const [newBlock, setNewBlock] = useState<Partial<Omit<TimeBlock, 'id' | 'color'>>>({
    title: '',
    startTime: '',
    endTime: '',
    category: 'personal',
    priority: 'medium'
  });

  const createEmptyWeek = (): WeekPlan => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    return {
      id: Date.now().toString(),
      title: `Semana de ${startOfWeek.toLocaleDateString('pt-BR')}`,
      days: daysOfWeek.map((dayName, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        return {
          date: date.toISOString().split('T')[0],
          dayName,
          blocks: []
        };
      }),
      goals: [],
      createdAt: new Date()
    };
  };

  const applyTemplate = (template: Template) => {
    const newWeek = createEmptyWeek();
    
    // Aplicar template de segunda a sexta
    for (let dayIndex = 1; dayIndex <= 5; dayIndex++) {
      newWeek.days[dayIndex].blocks = template.defaultBlocks.map((block, i) => ({
        ...block,
        id: `${dayIndex}-${i}-${Date.now()}`,
        color: categories.find(c => c.id === block.category)?.color || '#6B7280',
        completed: false
      }));
    }

    setCurrentWeek(newWeek);
    setCurrentView('weekly');
    setScore(prev => prev + 50);
    setGameStarted(true);
  };

  const addTimeBlock = () => {
    if (!currentWeek || !newBlock.title || !newBlock.startTime || !newBlock.endTime) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const block: TimeBlock = {
      id: `${selectedDay}-${Date.now()}-${Math.random()}`,
      title: newBlock.title,
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      category: newBlock.category || 'personal',
      priority: newBlock.priority || 'medium',
      color: categories.find(c => c.id === (newBlock.category || 'personal'))?.color || '#6B7280',
      completed: false
    };

    const updatedWeek = { ...currentWeek };
    if (!updatedWeek.days[selectedDay].blocks) {
      updatedWeek.days[selectedDay].blocks = [];
    }
    
    updatedWeek.days[selectedDay].blocks.push(block);
    updatedWeek.days[selectedDay].blocks.sort((a, b) => a.startTime.localeCompare(b.startTime));

    setCurrentWeek(updatedWeek);
    setScore(prev => prev + 10);
    
    setNewBlock({
      title: '',
      startTime: '',
      endTime: '',
      category: 'personal',
      priority: 'medium'
    });
  };

  const removeTimeBlock = (dayIndex: number, blockId: string) => {
    if (!currentWeek) return;
    
    const updatedWeek = { ...currentWeek };
    updatedWeek.days[dayIndex].blocks = updatedWeek.days[dayIndex].blocks.filter(b => b.id !== blockId);
    setCurrentWeek(updatedWeek);
    setScore(prev => Math.max(0, prev - 5));
  };

  const toggleBlockComplete = (dayIndex: number, blockId: string) => {
    if (!currentWeek) return;
    
    const updatedWeek = { ...currentWeek };
    const block = updatedWeek.days[dayIndex].blocks.find(b => b.id === blockId);
    
    if (block) {
      block.completed = !block.completed;
      setCurrentWeek(updatedWeek);
      setScore(prev => prev + (block.completed ? 5 : -5));
    }
  };

  const calculateStats = () => {
    if (!currentWeek) return { totalBlocks: 0, completedBlocks: 0, hoursPlanned: 0 };

    let totalBlocks = 0;
    let completedBlocks = 0;
    let hoursPlanned = 0;

    currentWeek.days.forEach(day => {
      totalBlocks += day.blocks.length;
      completedBlocks += day.blocks.filter(b => b.completed).length;
      
      day.blocks.forEach(block => {
        const start = new Date(`2000-01-01T${block.startTime}`);
        const end = new Date(`2000-01-01T${block.endTime}`);
        const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        hoursPlanned += diff;
      });
    });

    return { totalBlocks, completedBlocks, hoursPlanned };
  };

  const stats = calculateStats();

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4">
              Planejamento de Tempo
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Crie rotinas estruturadas e organize o tempo de forma visual e eficiente
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Objetivo
                </h3>
                <p className="text-sm text-gray-600">
                  Criar cronogramas semanais estruturados mas flexíveis, reduzindo a sobrecarga cognitiva
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  Como Usar
                </h3>
                <p className="text-sm text-gray-600">
                  Escolha templates prontos ou crie do zero. Organize blocos de tempo e acompanhe o progresso
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  Gamificação
                </h3>
                <p className="text-sm text-gray-600">
                  Ganhe pontos criando e completando blocos. Pratique a estruturação consciente do tempo
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">Escolha um Template para Começar</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {templates.map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:border-green-300">
                  <div className="text-3xl sm:text-4xl mb-3">{template.icon}</div>
                  <h4 className="font-bold text-green-700 mb-2 text-base sm:text-lg">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="text-xs text-gray-500 mb-4">
                    {template.defaultBlocks.length} blocos de tempo inclusos
                  </div>
                  <button
                    onClick={() => applyTemplate(template)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 font-semibold"
                  >
                    Usar Template
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  const newWeek = createEmptyWeek();
                  setCurrentWeek(newWeek);
                  setCurrentView('daily');
                  setGameStarted(true);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Começar do Zero
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      {/* Status Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Pontuação</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Blocos</p>
              <p className="text-sm sm:text-lg font-semibold">{stats.totalBlocks}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Horas</p>
              <p className="text-sm sm:text-lg font-semibold">{stats.hoursPlanned.toFixed(1)}h</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setGameStarted(false);
                setCurrentWeek(null);
                setScore(0);
              }}
              className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 pb-4 mb-6 overflow-x-auto">
          {[
            { id: 'templates', name: 'Templates', icon: '🚀' },
            { id: 'daily', name: 'Diário', icon: '📅' },
            { id: 'weekly', name: 'Semanal', icon: '📊' },
            { id: 'analysis', name: 'Análise', icon: '📈' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id as any)}
              className={`px-3 sm:px-4 py-2 text-sm rounded-lg font-semibold whitespace-nowrap transition-colors mr-2 ${
                currentView === view.id
                  ? 'bg-green-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{view.icon}</span>
              {view.name}
            </button>
          ))}
        </div>

        {/* Views */}
        {currentView === 'templates' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Escolha um Template
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {templates.map((template, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">{template.icon}</div>
                  <h4 className="font-bold text-green-700 mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <button
                    onClick={() => applyTemplate(template)}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Usar Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'daily' && currentWeek && (
          <div className="space-y-4 sm:space-y-6">
            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {daysOfWeek.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                    selectedDay === index
                      ? 'bg-green-600 text-white shadow'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Add Block Form */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Adicionar Bloco de Tempo
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Título *</label>
                  <input
                    type="text"
                    placeholder="Ex: Trabalho Focado"
                    value={newBlock.title || ''}
                    onChange={e => setNewBlock(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Início *</label>
                  <input
                    type="time"
                    value={newBlock.startTime || ''}
                    onChange={e => setNewBlock(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Fim *</label>
                  <input
                    type="time"
                    value={newBlock.endTime || ''}
                    onChange={e => setNewBlock(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Categoria</label>
                  <select
                    value={newBlock.category}
                    onChange={e => setNewBlock(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Prioridade</label>
                  <select
                    value={newBlock.priority}
                    onChange={e => setNewBlock(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="high">🔴 Alta</option>
                    <option value="medium">🟡 Média</option>
                    <option value="low">🟢 Baixa</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={addTimeBlock}
                    className="w-full p-2 sm:p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-semibold text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            {/* Day Blocks */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">
                {daysOfWeek[selectedDay]} - {currentWeek.days[selectedDay].blocks.length} blocos
              </h4>
              
              <div className="space-y-3">
                {currentWeek.days[selectedDay].blocks.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Nenhum bloco adicionado ainda</p>
                  </div>
                ) : (
                  currentWeek.days[selectedDay].blocks.map(block => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow"
                      style={{ borderLeftColor: block.color }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <button onClick={() => toggleBlockComplete(selectedDay, block.id)}>
                          {block.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full hover:border-green-500 transition-colors" />
                          )}
                        </button>
                        
                        <div className={block.completed ? 'opacity-50' : ''}>
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">{block.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {block.startTime} - {block.endTime}
                            </span>
                            <span>{categories.find(c => c.id === block.category)?.icon}</span>
                            <span className={
                              block.priority === 'high' ? 'text-red-500' :
                              block.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                            }>●</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeTimeBlock(selectedDay, block.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === 'weekly' && currentWeek && (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg font-bold text-gray-800">Visão Semanal</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
              {currentWeek.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`bg-white p-3 sm:p-4 rounded-xl border ${
                    dayIndex === 0 || dayIndex === 6 ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <h4 className="font-bold text-center text-sm border-b pb-2 mb-3">
                    {day.dayName}
                  </h4>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {day.blocks.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">Vazio</p>
                    ) : (
                      day.blocks.map(block => (
                        <div
                          key={block.id}
                          className={`p-2 rounded text-xs text-white ${
                            block.completed ? 'opacity-60' : ''
                          }`}
                          style={{ backgroundColor: block.color }}
                        >
                          <p className="font-semibold truncate">{block.title}</p>
                          <p className="text-xs opacity-90">
                            {block.startTime} - {block.endTime}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'analysis' && currentWeek && (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg font-bold text-gray-800">Análise do Planejamento</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h4 className="font-semibold mb-4">Distribuição por Categoria</h4>
                <div className="space-y-3">
                  {categories.map(cat => {
                    const count = currentWeek.days.reduce((acc, day) =>
                      acc + day.blocks.filter(b => b.category === cat.id).length, 0
                    );
                    const percentage = stats.totalBlocks > 0
                      ? Math.round((count / stats.totalBlocks) * 100)
                      : 0;

                    return (
                      <div key={cat.id} className="flex items-center justify-between">
                        <span className="text-sm flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: cat.color
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8 text-right">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h4 className="font-semibold mb-4">Resumo Geral</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total de Blocos:</span>
                    <span className="font-semibold">{stats.totalBlocks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Blocos Completados:</span>
                    <span className="font-semibold text-green-600">{stats.completedBlocks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Horas Planejadas:</span>
                    <span className="font-semibold">{stats.hoursPlanned.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxa de Conclusão:</span>
                    <span className="font-semibold">
                      {stats.totalBlocks > 0
                        ? Math.round((stats.completedBlocks / stats.totalBlocks) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <h4 className="font-semibold mb-4">Distribuição por Dia</h4>
              <div className="grid grid-cols-7 gap-2">
                {currentWeek.days.map((day, index) => (
                  <div key={index} className="text-center">
                    <p className="text-xs text-gray-600 mb-1">{day.dayName.slice(0, 3)}</p>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <p className="text-lg font-bold text-green-600">{day.blocks.length}</p>
                      <p className="text-xs text-gray-500">blocos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 7. COMPONENTE PRINCIPAL
// ============================================================================
export default function LudiTEAApp() {
  const [currentSection, setCurrentSection] = useState<'home' | 'patients' | 'planning'>('home');

  const handleNavigation = (section: 'home' | 'patients' | 'planning') => {
    setCurrentSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader currentSection={currentSection} onNavigate={handleNavigation} />
      
      {currentSection === 'home' && (
        <HomeSection onSelectModule={handleNavigation} />
      )}
      
      {currentSection === 'patients' && (
        <PatientsModule onNavigate={handleNavigation} />
      )}
      
      {currentSection === 'planning' && (
        <PlanningModule onNavigate={handleNavigation} />
      )}
    </div>
  );
}
