export type MemoryMode = 'sky' | 'memory' | 'grand-finale' | 'secret';

export interface ConstellationNode {
  id: string;
  title: string;
  date: string;
  description: string;
  story: string;
  position: [number, number, number];
  color: string;
  accent: string;
  images: string[];
  imageCaptions: string[];
  isSecret?: boolean;
}

export interface SecretQuestion {
  id: string;
  prompt: string;
  answer: string;
}

export interface SecretState {
  isUnlocked: boolean;
  currentQuestion: number;
  status: 'idle' | 'success' | 'error';
}
