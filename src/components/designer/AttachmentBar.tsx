import { File, X, Image as ImageIcon, Headphones } from 'lucide-react';
import type { VerkoDesignAttachment } from '../../types/designer';

interface AttachmentBarProps {
  attachments: (File | VerkoDesignAttachment)[];
  onRemove: (idx: number) => void;
}

export default function AttachmentBar({ attachments, onRemove }: AttachmentBarProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3 bg-[rgba(255,255,255,0.02)] border-b border-verko-border">
      {attachments.map((att, idx) => {
        let name = 'Archivo guardado';
        let isFile = false;
        if ('name' in att) {
          name = att.name;
          isFile = true;
        }

        const isImage = isFile && (att as File).type.startsWith('image/') || (!isFile && (att as VerkoDesignAttachment).tipo === 'png');
        const isAudio = isFile && (att as File).type.startsWith('audio/') || (!isFile && (att as VerkoDesignAttachment).tipo === 'nota_voz');

        return (
          <div key={idx} className="relative flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] pl-2 pr-8 py-1.5 rounded-lg text-[12px] flex-shrink-0 animate-in fade-in zoom-in-95">
            {isImage ? <ImageIcon className="w-3.5 h-3.5 text-verko-gold" /> : (
              isAudio ? <Headphones className="w-3.5 h-3.5 text-verko-blue" /> : <File className="w-3.5 h-3.5 text-verko-secondary" />
            )}
            <span className="truncate max-w-[120px] text-verko-text">{name}</span>
            <button 
              onClick={() => onRemove(idx)}
              className="absolute right-1.5 p-1 rounded-md text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
