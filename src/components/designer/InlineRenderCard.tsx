import Card from '../ui/Card';
import Button from '../ui/Button';

interface InlineRenderCardProps {
  status: 'pending' | 'generating' | 'completed' | 'error';
  imageUrl?: string;
  onGenerateClick?: () => void;
  onGalleryClick?: () => void;
}

export default function InlineRenderCard({ status, imageUrl, onGenerateClick, onGalleryClick }: InlineRenderCardProps) {
  return (
    <Card className="w-full max-w-[320px] my-3 border border-[rgba(199,153,67,0.3)] shadow-[0_4px_24px_rgba(199,153,67,0.08)] bg-gradient-to-b from-[rgba(199,153,67,0.08)] to-[rgba(199,153,67,0.01)]">
      <div className="p-4">
        {status === 'pending' && (
          <>
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-gold mb-2">Nuevo Render</p>
            <p className="text-sm text-verko-text mb-4">Tengo parámetros suficientes para generar un diseño 3D. ¿Querés que lo genere?</p>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" onClick={onGenerateClick}>Generar Render</Button>
            </div>
          </>
        )}
        
        {status === 'generating' && (
          <div className="flex items-center gap-3 py-2">
            <div className="w-4 h-4 rounded-full border-2 border-verko-gold/30 border-t-verko-gold animate-spin" />
            <p className="text-sm text-verko-gold">Generando estudio 3D...</p>
          </div>
        )}

        {status === 'completed' && imageUrl && (
          <>
            <img src={imageUrl} alt="Render 3D" className="w-full h-auto rounded-xl object-cover mb-3" />
            <div className="flex gap-2">
              <Button size="sm" variant="default" onClick={onGalleryClick} className="w-full">
                Ver Galería
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
