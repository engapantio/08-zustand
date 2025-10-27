import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CreateNoteData } from '../api';

interface DraftNoteStore {
  draft: CreateNoteData;
  setDraft: (note: CreateNoteData) => void;
  clearDraft: () => void;
}

export const initialDraft: CreateNoteData = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useDraftNoteStore = create<DraftNoteStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      // Ключ у localStorage
      name: 'note-draft',
      partialize: state => ({ draft: state.draft }),
    }
  )
);
