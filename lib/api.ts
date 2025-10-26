// lib/api.ts

import axios from 'axios';
import { Note } from '../types/note';
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
  content: string;
}

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] =
  process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string,
  perPage: number = 12
): Promise<FetchNotesResponse> => {
  const searchQuery = search ? search : '';

  const params = tag
    ? {
        search: searchQuery,
        tag,
        page,
        perPage,
      }
    : {
        search: searchQuery,
        page,
        perPage,
      };

  const response = await axios.get<FetchNotesResponse>('/notes', {
    params,
  });
  return response.data;
};

export const createNote = async (newNote: CreateNoteData): Promise<Note> => {
  const response = await axios.post<Note>('/notes', newNote);
  return response.data;
};

export const deleteNote = async (id: Note['id']): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: Note['id']): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`);
  return response.data;
};
