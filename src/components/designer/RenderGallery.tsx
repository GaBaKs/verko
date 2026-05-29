import { Render } from '../../hooks/useRenderStudio';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

interface RenderGalleryProps {
  renders: Render[];
}

export default function RenderGallery({ renders }: RenderGalleryProps) {
  if (renders.length === 0) {
    return (
      <div className="p-8 text-center text-verko-secondary text-sm">
        No hay renders generados para esta obra todavía.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {renders.map(r => {
        const isCompleted = r.estado === 'completado';
        const isFailed = r.estado === 'fallido' || r.estado === 'cancelado';
        const isProcessing = r.estado === 'procesando' || r.estado === 'en_cola';

        return (
          <Card key={r.id} className="flex flex-col h-full bg-verko-card">
            <div className="aspect-[4/3] bg-verko-bg border-b border-[rgba(255,255,255,0.06)] relative overflow-hidden flex items-center justify-center">
              {isCompleted && r.resultado_url ? (
                <img src={r.resultado_url} alt="Render" className="w-full h-full object-cover" />
              ) : isProcessing ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-t-verko-gold border-[rgba(184,151,58,0.3)] rounded-full animate-spin" />
                  <span className="font-mono text-[10px] tracking-widest text-verko-gold">GPU PROCESSING</span>
                </div>
              ) : (
                <AlertTriangle className="w-8 h-8 text-verko-red opacity-50" />
              )}
              
              {/* Overlay Badges */}
              <div className="absolute top-2 left-2">
                {isCompleted && <Badge tone="green"><CheckCircle className="w-3 h-3" /> Listo</Badge>}
                {isFailed && <Badge tone="red"><AlertTriangle className="w-3 h-3" /> Error</Badge>}
                {isProcessing && <Badge tone="orange"><Clock className="w-3 h-3" /> Generando</Badge>}
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h4 className="font-sans text-[13px] text-verko-text font-medium truncate mb-1">
                {(r as any).ambiente || 'Ambiente sin título'}
              </h4>
              <p className="font-mono text-[10px] text-verko-dim line-clamp-2 mb-4 flex-1">
                {(r as any).prompt_usuario || 'Sin prompt...'}
              </p>
              
              {isCompleted && r.resultado_url && (
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-[rgba(255,255,255,0.06)]">
                  <a href={r.resultado_url} target="_blank" rel="noreferrer" className="text-verko-gold hover:text-verko-gold-light text-xs font-medium flex items-center gap-1">
                    <Download className="w-3 h-3" /> Full Res
                  </a>
                  <Button size="sm" variant="default" className="text-[11px] h-7 px-3">
                    Aprobar Idea
                  </Button>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
