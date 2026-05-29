import type { Database } from './database';

export type VerkoDesignSession = Database['public']['Tables']['verko_design_sessions']['Row'];

export interface VerkoDesignConversation {
  id: string;
  session_id: string | null;
  thread_id: string | null;
  user_id: string | null;
  rol: 'user' | 'agent' | 'system';
  canal: 'web' | 'whatsapp' | 'api';
  intent: string | null;
  texto: string | null;
  transcripcion: string | null;
  vision_json: unknown | null;
  tokens_in: number | null;
  tokens_out: number | null;
  latency_ms: number | null;
  created_at: string;
}

export interface VerkoDesignAttachment {
  id: string;
  session_id: string | null;
  thread_id: string | null;
  user_id: string | null;
  tipo: 'dxf' | 'pdf' | 'png' | 'json' | 'other' | 'foto_espacio' | 'nota_voz' | 'vision_json';
  storage_path: string;
  mime: string | null;
  mime_type: string | null;
  file_size_kb: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
