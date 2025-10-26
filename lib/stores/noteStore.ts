import { create } from 'zustand';
import { CreateNoteData } from '../api';

interface DraftNoteStore {
  draft: CreateNoteData;
  setDraft: (note: CreateNoteData) => void;
  clearDraft: () => void;
}

const initialDraft: CreateNoteData = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useDraftNoteStore = create<DraftNoteStore>()(set => ({
  draft: initialDraft,
  setDraft: note => set(() => ({ draft: note })),
  clearDraft: () => set(() => ({ draft: initialDraft })),
}));
