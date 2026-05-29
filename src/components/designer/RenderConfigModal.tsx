import { useState } from 'react';
import Modal, { ModalHeader } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import CustomSelect from '../ui/CustomSelect';

interface RenderConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (params: { modelo_codigo: string; ambiente: string; prompt: string; lora_scale?: number }) => Promise<void>;
}

export default function RenderConfigModal({ isOpen, onClose, onGenerate }: RenderConfigModalProps) {
  const [ambiente, setAmbiente] = useState('Cocina');
  const [modelo, setModelo] = useState('realvisXL');
  const [prompt, setPrompt] = useState('Cocina moderna con isla central, mesada de cuarzo blanco, muebles de MDF laqueado gris oscuro, iluminación cenital y luz natural por ventana grande.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!ambiente || !prompt) return;
    setIsSubmitting(true);
    try {
      await onGenerate({
        ambiente,
        modelo_codigo: modelo,
        prompt
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader 
        title="Configurar Render 3D" 
        subtitle="Verificá los parámetros de la IA antes de enviar el trabajo a la GPU. El costo será debitado de los tokens de la organización."
      />
      
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Ambiente / Espacio" 
            value={ambiente} 
            onChange={e => setAmbiente(e.target.value)} 
          />
          <CustomSelect 
            label="Modelo Base (LoRA)" 
            value={modelo} 
            onChange={(val) => setModelo(val)}
            options={[
              { value: "realvisXL", label: "RealVis XL (Fotorrealismo)" },
              { value: "sdxl_lightning", label: "SDXL Lightning (Rápido)" },
              { value: "verko_v1", label: "VERKO Style v1 (Premium)" }
            ]}
          />
        </div>
        
        <Textarea 
          label="Prompt (Director de Fotografía)" 
          value={prompt} 
          onChange={e => setPrompt(e.target.value)} 
          rows={3} 
        />
        
        <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-[rgba(255,255,255,0.06)]">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando generación...' : 'Generar en GPU'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
