import Image from 'next/image';

interface MascoteLeoProps {
  fala: string;
}

export default function MascoteLeo({ fala }: MascoteLeoProps) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(fala);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 z-50">
      <Image
        src="/images/mascotes/leo/leo-dica.webp"
        alt="Leo mascote"
        width={100}
        height={100}
        className="drop-shadow-xl"
      />
      <div className="bg-white rounded-xl px-4 py-2 text-purple-800 font-bold shadow-lg animate-fade-in">
        {fala}
      </div>
    </div>
  );
}
