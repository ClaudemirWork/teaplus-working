'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, X, Volume2, CornerLeftUp, HelpCircle, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

// AÇÃO 1: Importar o cliente Supabase que criamos no local correto
import { createClient } from '../../../utils/supabaseClient';

export default function CAAActivityPage() {
    // AÇÃO 2: Criar a instância do cliente Supabase para usarmos na página
    const supabase = createClient();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('necessidades');
    const [message, setMessage] = useState('');
    const [selectedSymbols, setSelectedSymbols] = useState([]);
    
    // Estados para métricas científicas validadas (seu código original, intacto)
    const [totalAtosComunicativos, setTotalAtosComunicativos] = useState(0);
    const [categoriasUtilizadas, setCategoriasUtilizadas] = useState(new Set());
    const [simbolosUnicos, setSimbolosUnicos] = useState(new Set());
    const [inicioSessao] = useState(new Date());
    const [sequenciaTemporal, setSequenciaTemporal] = useState([]);

    // ... (Toda a sua estrutura de dados 'symbols' e 'activityInfo' permanece aqui, intacta) ...
    const symbols = {
        necessidades: [ { text: 'Quero comer', icon: '🍔' }, { text: 'Quero beber', icon: '🥤' }, { text: 'Preciso de ajuda', icon: '🤝' }, { text: 'Quero ir ao banheiro', icon: '🚽' }, { text: 'Quero ir para casa', icon: '🏠' }, { text: 'Quero ir para a escola', icon: '🏫' }, ],
        sentimentos: [ { text: 'Estou feliz', icon: '😊' }, { text: 'Estou triste', icon: '😢' }, { text: 'Estou com raiva', icon: '😡' }, { text: 'Estou com medo', icon: '😨' }, { text: 'Me sinto doente', icon: '🤒' }, { text: 'Estou com dor', icon: '🤕' }, ],
        acoes: [ { text: 'Quero brincar', icon: '🪁' }, { text: 'Quero desenhar', icon: '🎨' }, { text: 'Quero ler um livro', icon: '📖' }, { text: 'Quero música', icon: '🎵' }, { text: 'Quero ir lá fora', icon: '🚶' }, { text: 'Vamos brincar agora', icon: '🎲' }, ],
        pessoas: [ { text: 'Mamãe', icon: '👩' }, { text: 'Papai', icon: '👨' }, { text: 'Amigo', icon: '👫' }, { text: 'Professor', icon: '🧑‍🏫' }, { text: 'Eu', icon: '🙋' }, ],
        lugares: [ { text: 'Sala', icon: '🛋️' }, { text: 'Quarto', icon: '🛏️' }, { text: 'Carro', icon: '🚗' }, { text: 'Supermercado', icon: '🛒' }, { text: 'Parque', icon: '🌳' }, { text: 'Brinquedo', icon: '🧸' }, { text: 'Celular', icon: '📱' }, ],
        comidas: [ { text: 'Maçã', icon: '🍎' }, { text: 'Banana', icon: '🍌' }, { text: 'Leite', icon: '🥛' }, { text: 'Pão', icon: '🍞' }, { text: 'Pizza', icon: '🍕' }, { text: 'Doce', icon: '🍬' }, { text: 'Água', icon: '💧' }, ],
        saude: [ { text: 'Banho', icon: '🚿' }, { text: 'Escovar os dentes', icon: '🦷' }, { text: 'Remédio', icon: '💊' }, { text: 'Febre', icon: '🌡️' }, { text: 'Dormir', icon: '😴' }, { text: 'Curativo', icon: '🩹' }, ],
        tempo: [ { text: 'Sol', icon: '☀️' }, { text: 'Lua', icon: '🌙' }, { text: 'Relógio', icon: '⏰' }, { text: 'Calendário', icon: '🗓️' }, { text: 'Escola', icon: '🏫' }, { text: 'Família', icon: '👨‍👩‍👧‍👦' }, ],
    };
    const activityInfo = { /* ... seu objeto activityInfo intacto ... */ };

    // ... (Todas as suas funções de handle, speakText, etc., permanecem aqui, intactas) ...
    const calcularAtosPorMinuto = () => { const agora = new Date(); const diferencaMinutos = (agora - inicioSessao) / 60000; return diferencaMinutos > 0 ? (totalAtosComunicativos / diferencaMinutos).toFixed(2) : 0; };
    const speakText = (text) => { if (typeof window !== 'undefined' && 'speechSynthesis' in window) { const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'pt-BR'; window.speechSynthesis.speak(utterance); } };
    const handleSymbolClick = (symbol) => { setSelectedSymbols(prevSymbols => [...prevSymbols, symbol]); speakText(symbol.text); setTotalAtosComunicativos(prev => prev + 1); setCategoriasUtilizadas(prev => new Set([...prev, selectedCategory])); setSimbolosUnicos(prev => new Set([...prev, symbol.text])); setSequenciaTemporal(prev => [...prev, { timestamp: new Date(), categoria: selectedCategory, simbolo: symbol.text, icon: symbol.icon }]); };
    const handleClearSentence = () => { setSelectedSymbols([]); setMessage(''); };
    const handleSpeakSentence = () => { if (selectedSymbols.length > 0) { const sentence = selectedSymbols.map(s => s.text).join(' '); speakText(sentence); setMessage(`Frase: ${sentence}`); setTotalAtosComunicativos(prev => prev + 1); setSequenciaTemporal(prev => [...prev, { timestamp: new Date(), tipo: 'frase_completa', conteudo: sentence, simbolos_count: selectedSymbols.length }]); } else { setMessage('Selecione um símbolo primeiro.'); } };
    const handleUndo = () => { setSelectedSymbols(prevSymbols => prevSymbols.slice(0, -1)); setMessage(''); };


    // AÇÃO 3: Adicionar a nova função para salvar a sessão no Supabase
    const handleSaveSession = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert('Erro: Você precisa estar logado para salvar a sessão.');
            console.error('Usuário não autenticado, salvamento cancelado.');
            return;
        }

        if (totalAtosComunicativos === 0) {
            alert('Nenhuma interação foi registrada para salvar.');
            return;
        }

        const duracaoFinalSegundos = Math.round((new Date() - inicioSessao) / 1000);
        const duracaoFinalMinutos = duracaoFinalSegundos / 60;
        const atosPorMinutoFinal = duracaoFinalMinutos > 0 ? (totalAtosComunicativos / duracaoFinalMinutos).toFixed(2) : '0.00';

        const { data, error } = await supabase
            .from('sessoes')
            .insert([{
                paciente_id: user.id, // Usamos o ID do usuário autenticado
                atividade: 'CAA',
                total_atos_comunicativos: totalAtosComunicativos,
                atos_por_minuto: parseFloat(atosPorMinutoFinal),
                categorias_exploradas: categoriasUtilizadas.size,
                simbolos_unicos: simbolosUnicos.size,
                duracao_segundos: duracaoFinalSegundos,
                concluida_em: new Date().toISOString()
            }]);

        if (error) {
            console.error('Erro ao salvar a sessão:', error);
            alert(`Ocorreu um erro ao salvar os dados: ${error.message}`);
        } else {
            console.log('Sessão salva com sucesso!', data);
            alert('Sessão finalizada e dados de progresso salvos com sucesso!');
            router.push('/profileselection'); // Volta para a tela de seleção de perfil
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="p-3 sm:p-4 flex items-center justify-between">
                    <Link
                        href="/tea"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px] touch-manipulation"
                    >
                        <ChevronLeft size={20} />
                        <span className="text-sm sm:text-base">Voltar</span>
                    </Link>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* AÇÃO 4: Adicionar o botão para "Finalizar e Salvar" a sessão */}
                        <button 
                          onClick={handleSaveSession}
                          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                        >
                            <Save size={20} />
                            <span>Finalizar e Salvar</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* ... (Todo o resto do seu JSX permanece aqui, intacto) ... */}
            <main className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
              {/* ... */}
            </main>
        </div>
    );
}
