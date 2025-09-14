'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, Trash2, Save, User, Brain, Edit3, Clock, CheckCircle, Users, FileText, TrendingUp, Award, Settings, Phone, MapPin, Bell, Star } from 'lucide-react'
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE HEADER PROFISSIONAL
// ============================================================================
const ProfessionalHeader = ({ title, subtitle }) => (
  <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white sticky top-0 z-10 shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-16">
        <Link
          href="/dashboard"
          className="flex items-center text-blue-100 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1 font-medium text-sm sm:text-base">Voltar ao LudiTEA</span>
        </Link>
        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6" />
            <span>{title}</span>
          </h1>
          {subtitle && <p className="text-xs text-blue-100">{subtitle}</p>}
        </div>
        <div className="w-32 flex justify-end">
          <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
            FOUNDER FREE
          </div>
        </div>
      </div>
    </div>
  </header>
);

// ============================================================================
// 2. INTERFACES E TIPOS DE DADOS
// ============================================================================
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
  completed?: boolean;
}

interface UserTier {
  type: 'FREE' | 'PRO' | 'CLINIC';
  isFounder: boolean;
  patientsLimit: number;
  featuresEnabled: string[];
}

// ============================================================================
// 3. DADOS E CONFIGURAÇÕES
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

const tierFeatures = {
  FREE: {
    patientsLimit: 10,
    features: ['Gestão básica de pacientes', 'Agenda simples', 'Relatórios básicos']
  },
  PRO: {
    patientsLimit: -1, // ilimitado
    features: ['Pacientes ilimitados', 'IA avançada', 'Relatórios personalizados', 'Integração LudiTEA']
  },
  CLINIC: {
    patientsLimit: -1,
    features: ['Multi-usuário', 'Dashboard clínica', 'White-label', 'API access']
  }
};

// ============================================================================
// 4. COMPONENTE PRINCIPAL LUDITEA DESK
// ============================================================================
export default function LudiTEADeskPage() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'patients' | 'calendar' | 'reports' | 'settings'>('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [userTier, setUserTier] = useState<UserTier>({
    type: 'FREE',
    isFounder: true, // Simulando founder member
    patientsLimit: 10,
    featuresEnabled: ['basic']
  });

  // Estados para formulários
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

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Dados mockados para demonstração
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
      },
      {
        id: '2',
        patientId: '2', 
        type: 'followup',
        title: 'Follow-up - Pedro',
        date: '2024-09-19',
        startTime: '16:00',
        endTime: '16:45',
        status: 'agendado',
        notes: 'Avaliar progresso com medicação',
        materials: ['Relatório escolar', 'Questionário SNAP-IV']
      }
    ];

    setPatients(mockPatients);
    setAppointments(mockAppointments);
  }, []);

  // Funções CRUD
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

  const addAppointment = () => {
    if (!newAppointment.patientId || !newAppointment.date || !newAppointment.startTime) return;

    const appointment: Appointment = {
      id: Date.now().toString(),
      patientId: newAppointment.patientId,
      type: newAppointment.type || 'terapia',
      title: newAppointment.title || `${appointmentTypes.find(t => t.id === newAppointment.type)?.name} - ${patients.find(p => p.id === newAppointment.patientId)?.name}`,
      date: newAppointment.date,
      startTime: newAppointment.startTime,
      endTime: newAppointment.endTime || '',
      status: 'agendado',
      notes: newAppointment.notes || '',
      materials: []
    };

    setAppointments(prev => [...prev, appointment]);
    setNewAppointment({
      type: 'terapia',
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      notes: '',
      materials: []
    });
    setIsAddingAppointment(false);
  };

  // Estatísticas para dashboard
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

  // ============================================================================
  // 5. RENDERIZAÇÃO DAS VIEWS
  // ============================================================================

  // Dashboard Principal
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Pacientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              <p className="text-xs text-gray-500">Limite: {userTier.isFounder ? '∞' : userTier.patientsLimit}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Consultas Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
              <p className="text-xs text-green-600">+2 vs ontem</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">LudiTEA Conectados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ludiTeaConnected}</p>
              <p className="text-xs text-blue-600">{Math.round((stats.ludiTeaConnected / stats.totalPatients) * 100)}% dos pacientes</p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Relatórios Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
              <p className="text-xs text-orange-600">Atenção necessária</p>
            </div>
            <FileText className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Agenda de Hoje */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Agenda de Hoje
          </h3>
          <div className="space-y-3">
            {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma consulta agendada para hoje</p>
            ) : (
              appointments
                .filter(apt => apt.date === new Date().toISOString().split('T')[0])
                .map(apt => {
                  const patient = patients.find(p => p.id === apt.patientId);
                  const typeInfo = appointmentTypes.find(t => t.id === apt.type);
                  return (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: typeInfo?.color }}
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{patient?.name}</p>
                          <p className="text-sm text-gray-600">{apt.startTime} - {typeInfo?.name}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
            )}
          </div>
          <button 
            onClick={() => {setCurrentView('calendar'); setIsAddingAppointment(true);}}
            className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Agendar Nova Consulta
          </button>
        </div>

        {/* Pacientes Recentes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Pacientes Recentes
          </h3>
          <div className="space-y-3">
            {patients.slice(0, 4).map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: diagnosisColors[patient.diagnosis] }}
                  >
                    {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.diagnosis} • {patient.age} anos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {patient.ludiTeaConnected && (
                    <Brain className="w-4 h-4 text-purple-500" title="LudiTEA Conectado" />
                  )}
                  <button 
                    onClick={() => {setSelectedPatient(patient); setCurrentView('patients');}}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => {setCurrentView('patients'); setIsAddingPatient(true);}}
            className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Adicionar Paciente
          </button>
        </div>
      </div>

      {/* Insights Rápidos */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Insights da Prática (IA)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Horário mais produtivo:</p>
            <p className="font-bold text-blue-600">14h - 16h</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Diagnóstico mais comum:</p>
            <p className="font-bold text-blue-600">TEA Moderado</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Taxa de engajamento LudiTEA:</p>
            <p className="font-bold text-green-600">85%</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Gestão de Pacientes
  const renderPatients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Gestão de Pacientes</h2>
        <button
          onClick={() => setIsAddingPatient(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Paciente
        </button>
      </div>

      {/* Lista de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map(patient => (
          <div key={patient.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: diagnosisColors[patient.diagnosis] }}
                >
                  {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.age} anos</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {patient.ludiTeaConnected && (
                  <Brain className="w-4 h-4 text-purple-500" title="LudiTEA Conectado" />
                )}
                <Star className="w-4 h-4 text-yellow-500" />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Diagnóstico:</span>
                <span className="font-semibold">{patient.diagnosis}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Severidade:</span>
                <span className={`font-semibold ${
                  patient.severity === 'Leve' ? 'text-green-600' :
                  patient.severity === 'Moderado' ? 'text-yellow-600' : 'text-red-600'
                }`}>{patient.severity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sessões:</span>
                <span className="font-semibold">{patient.sessionsCount}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{patient.address}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPatient(patient)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Ver Detalhes
              </button>
              <button className="bg-gray-100 text-gray-600 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Adicionar Paciente */}
      {isAddingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Novo Paciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={newPatient.name || ''}
                  onChange={e => setNewPatient(prev => ({...prev, name: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do paciente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade *</label>
                <input
                  type="number"
                  value={newPatient.age || ''}
                  onChange={e => setNewPatient(prev => ({...prev, age: parseInt(e.target.value)}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Idade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico *</label>
                <select
                  value={newPatient.diagnosis}
                  onChange={e => setNewPatient(prev => ({...prev, diagnosis: e.target.value as any}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TEA">TEA</option>
                  <option value="TDAH">TDAH</option>
                  <option value="TEA+TDAH">TEA + TDAH</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severidade</label>
                <select
                  value={newPatient.severity}
                  onChange={e => setNewPatient(prev => ({...prev, severity: e.target.value as any}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Leve">Leve</option>
                  <option value="Moderado">Moderado</option>
                  <option value="Severo">Severo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                <input
                  type="text"
                  value={newPatient.guardian || ''}
                  onChange={e => setNewPatient(prev => ({...prev, guardian: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do responsável"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={newPatient.phone || ''}
                  onChange={e => setNewPatient(prev => ({...prev, phone: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newPatient.email || ''}
                  onChange={e => setNewPatient(prev => ({...prev, email: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={newPatient.address || ''}
                  onChange={e => setNewPatient(prev => ({...prev, address: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Endereço completo"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={newPatient.notes || ''}
                  onChange={e => setNewPatient(prev => ({...prev, notes: e.target.value}))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Observações sobre o paciente..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newPatient.ludiTeaConnected || false}
                    onChange={e => setNewPatient(prev => ({...prev, ludiTeaConnected: e.target.checked}))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Família usa LudiTEA</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={addPatient}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Salvar Paciente
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

  // ============================================================================
  // 6. NAVEGAÇÃO E LAYOUT PRINCIPAL
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader 
        title="LudiTEA Desk" 
        subtitle="Gestão Clínica Inteligente para TEA e TDAH"
      />
      
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'patients', name: 'Pacientes', icon: Users },
              { id: 'calendar', name: 'Agenda', icon: Calendar },
              { id: 'reports', name: 'Relatórios', icon: FileText },
              { id: 'settings', name: 'Configurações', icon: Settings }
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

          {/* Status do Plano */}
          <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-800">FOUNDER FREE</span>
            </div>
            <p className="text-xs text-yellow-700 mb-3">
              Você tem acesso vitalício a todas as funcionalidades PRO por apoiar nossa missão desde o início!
            </p>
            <div className="space-y-1 text-xs text-yellow-600">
              <div className="flex justify-between">
                <span>Pacientes:</span>
                <span className="font-bold">Ilimitados</span>
              </div>
              <div className="flex justify-between">
                <span>IA Avançada:</span>
                <span className="font-bold">✓ Ativa</span>
              </div>
              <div className="flex justify-between">
                <span>Integração LudiTEA:</span>
                <span className="font-bold">✓ Ativa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 p-6">
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'patients' && renderPatients()}
          {currentView === 'calendar' && (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Agenda em Desenvolvimento</h3>
              <p className="text-gray-600">Funcionalidade de agenda será implementada na próxima versão.</p>
            </div>
          )}
          {currentView === 'reports' && (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios com IA</h3>
              <p className="text-gray-600">Sistema de relatórios inteligentes será implementado em breve.</p>
            </div>
          )}
          {currentView === 'settings' && (
            <div className="text-center py-20">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações</h3>
              <p className="text-gray-600">Área de configurações e preferências em desenvolvimento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
