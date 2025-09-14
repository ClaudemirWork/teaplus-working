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

  // Agenda/Calendar
  const renderCalendar = () => {
    const today = new Date();
    const todayAppointments = appointments.filter(apt => apt.date === selectedDate);
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Agenda</h2>
          <button
            onClick={() => setIsAddingAppointment(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Consulta
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seletor de Data */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Selecionar Data</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            {/* Resumo do Dia */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total de consultas:</span>
                <span className="font-bold">{todayAppointments.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tempo ocupado:</span>
                <span className="font-bold">
                  {todayAppointments.reduce((total, apt) => {
                    if (!apt.startTime || !apt.endTime) return total;
                    const start = new Date(`2000-01-01T${apt.startTime}`);
                    const end = new Date(`2000-01-01T${apt.endTime}`);
                    return total + (end.getTime() - start.getTime()) / (1000 * 60);
                  }, 0)} min
                </span>
              </div>
            </div>

            {/* Tipos de Consulta */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">Tipos de Consulta</h4>
              <div className="space-y-2">
                {appointmentTypes.map(type => (
                  <div key={type.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <span>{type.icon} {type.name}</span>
                    </div>
                    <span className="text-gray-500">{type.duration}min</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Consultas do Dia */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">
              Consultas - {new Date(selectedDate).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>

            {todayAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma consulta agendada para este dia</p>
                <button
                  onClick={() => setIsAddingAppointment(true)}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Agendar primeira consulta
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(apt => {
                    const patient = patients.find(p => p.id === apt.patientId);
                    const typeInfo = appointmentTypes.find(t => t.id === apt.type);
                    
                    return (
                      <div key={apt.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div 
                              className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                              style={{ backgroundColor: typeInfo?.color }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-gray-900">{patient?.name || 'Paciente não encontrado'}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  apt.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                                  apt.status === 'concluido' ? 'bg-green-100 text-green-800' :
                                  apt.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {apt.status}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {apt.startTime} - {apt.endTime}
                                </span>
                                <span>{typeInfo?.icon} {typeInfo?.name}</span>
                                {patient?.diagnosis && (
                                  <span className={`px-2 py-1 rounded text-xs font-medium text-white`}
                                    style={{ backgroundColor: diagnosisColors[patient.diagnosis] }}
                                  >
                                    {patient.diagnosis}
                                  </span>
                                )}
                              </div>

                              {apt.notes && (
                                <p className="text-sm text-gray-600 mb-2">{apt.notes}</p>
                              )}

                              {apt.materials && apt.materials.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {apt.materials.map((material, index) => (
                                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                      {material}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            {patient?.ludiTeaConnected && (
                              <Brain className="w-4 h-4 text-purple-500" title="LudiTEA Conectado" />
                            )}
                            <button 
                              onClick={() => {
                                const updatedAppointments = appointments.map(a => 
                                  a.id === apt.id 
                                    ? { ...a, status: a.status === 'concluido' ? 'agendado' : 'concluido' }
                                    : a
                                );
                                setAppointments(updatedAppointments);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                apt.status === 'concluido' 
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setAppointments(prev => prev.filter(a => a.id !== apt.id));
                              }}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Adicionar Consulta */}
        {isAddingAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Nova Consulta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente *</label>
                  <select
                    value={newAppointment.patientId || ''}
                    onChange={e => setNewAppointment(prev => ({...prev, patientId: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione um paciente</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.diagnosis})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Consulta *</label>
                  <select
                    value={newAppointment.type}
                    onChange={e => {
                      const selectedType = appointmentTypes.find(t => t.id === e.target.value);
                      if (newAppointment.startTime && selectedType) {
                        const startTime = new Date(`2000-01-01T${newAppointment.startTime}`);
                        const endTime = new Date(startTime.getTime() + selectedType.duration * 60000);
                        setNewAppointment(prev => ({
                          ...prev, 
                          type: e.target.value as any,
                          endTime: endTime.toTimeString().slice(0, 5)
                        }));
                      } else {
                        setNewAppointment(prev => ({...prev, type: e.target.value as any}));
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {appointmentTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name} ({type.duration}min)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                  <input
                    type="date"
                    value={newAppointment.date || selectedDate}
                    onChange={e => setNewAppointment(prev => ({...prev, date: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário Início *</label>
                  <input
                    type="time"
                    value={newAppointment.startTime || ''}
                    onChange={e => {
                      const selectedType = appointmentTypes.find(t => t.id === newAppointment.type);
                      if (selectedType) {
                        const startTime = new Date(`2000-01-01T${e.target.value}`);
                        const endTime = new Date(startTime.getTime() + selectedType.duration * 60000);
                        setNewAppointment(prev => ({
                          ...prev, 
                          startTime: e.target.value,
                          endTime: endTime.toTimeString().slice(0, 5)
                        }));
                      } else {
                        setNewAppointment(prev => ({...prev, startTime: e.target.value}));
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário Fim</label>
                  <input
                    type="time"
                    value={newAppointment.endTime || ''}
                    onChange={e => setNewAppointment(prev => ({...prev, endTime: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título Personalizado</label>
                  <input
                    type="text"
                    value={newAppointment.title || ''}
                    onChange={e => setNewAppointment(prev => ({...prev, title: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Deixe vazio para gerar automaticamente"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={newAppointment.notes || ''}
                    onChange={e => setNewAppointment(prev => ({...prev, notes: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Objetivos da sessão, pontos importantes..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={addAppointment}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Agendar Consulta
                </button>
                <button
                  onClick={() => setIsAddingAppointment(false)}
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

  // Relatórios
  const renderReports = () => {
    const patientStats = patients.map(patient => {
      const patientAppointments = appointments.filter(apt => apt.patientId === patient.id);
      const completedSessions = patientAppointments.filter(apt => apt.status === 'concluido').length;
      const totalScheduled = patientAppointments.length;
      const attendanceRate = totalScheduled > 0 ? (completedSessions / totalScheduled) * 100 : 0;

      return {
        ...patient,
        completedSessions,
        totalScheduled,
        attendanceRate: Math.round(attendanceRate)
      };
    });

    const overallStats = {
      totalPatients: patients.length,
      avgAge: patients.length > 0 ? Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length) : 0,
      diagnosisBreakdown: patients.reduce((acc, p) => {
        acc[p.diagnosis] = (acc[p.diagnosis] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      ludiTeaAdoption: patients.length > 0 ? Math.round((patients.filter(p => p.ludiTeaConnected).length / patients.length) * 100) : 0
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Relatórios e Análises</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pacientes Ativos</h3>
            <p className="text-3xl font-bold text-blue-600">{overallStats.totalPatients}</p>
            <p className="text-sm text-gray-600 mt-1">Idade média: {overallStats.avgAge} anos</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Adoção LudiTEA</h3>
            <p className="text-3xl font-bold text-purple-600">{overallStats.ludiTeaAdoption}%</p>
            <p className="text-sm text-gray-600 mt-1">{patients.filter(p => p.ludiTeaConnected).length} famílias conectadas</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Consultas Este Mês</h3>
            <p className="text-3xl font-bold text-green-600">{appointments.length}</p>
            <p className="text-sm text-gray-600 mt-1">
              {appointments.filter(apt => apt.status === 'concluido').length} concluídas
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Taxa de Presença</h3>
            <p className="text-3xl font-bold text-orange-600">
              {appointments.length > 0 ? Math.round((appointments.filter(apt => apt.status === 'concluido').length / appointments.length) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Média da prática</p>
          </div>
        </div>

        {/* Breakdown por Diagnóstico */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Distribuição por Diagnóstico</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(overallStats.diagnosisBreakdown).map(([diagnosis, count]) => (
              <div key={diagnosis} className="text-center p-4 bg-gray-50 rounded-lg">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: diagnosisColors[diagnosis as keyof typeof diagnosisColors] }}
                >
                  {count}
                </div>
                <p className="font-semibold text-gray-900">{diagnosis}</p>
                <p className="text-sm text-gray-600">
                  {overallStats.totalPatients > 0 ? Math.round((count / overallStats.totalPatients) * 100) : 0}% do total
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Desempenho por Paciente */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Desempenho Individual</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Paciente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Diagnóstico</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Sessões</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Taxa Presença</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">LudiTEA</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {patientStats.map(patient => (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: diagnosisColors[patient.diagnosis] }}
                        >
                          {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.age} anos</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white`}
                        style={{ backgroundColor: diagnosisColors[patient.diagnosis] }}
                      >
                        {patient.diagnosis}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold">{patient.completedSessions}</span>
                      <span className="text-gray-500">/{patient.totalScheduled}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        patient.attendanceRate >= 80 ? 'text-green-600' :
                        patient.attendanceRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {patient.attendanceRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {patient.ludiTeaConnected ? (
                        <Brain className="w-5 h-5 text-purple-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights de IA (Placeholder para quando implementarmos) */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Insights Personalizados (IA)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Padrão identificado:</p>
              <p className="font-semibold text-gray-900">Pacientes TEA respondem melhor às 14h</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Recomendação:</p>
              <p className="font-semibold text-gray-900">Aumentar uso do LudiTEA em 3 famílias</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Alerta:</p>
              <p className="font-semibold text-orange-600">Pedro precisa de follow-up urgente</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
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
          {currentView === 'calendar' && renderCalendar()}
          {currentView === 'reports' && renderReports()}
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
