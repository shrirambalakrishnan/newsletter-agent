import {FunctionTool, LlmAgent} from '@google/adk';
import {z} from 'zod';

const notes: string[] = [];

const saveNote = new FunctionTool({
  name: 'save_note',
  description: 'saves a note for user. call this whenever user says something they want to remember.',
  parameters: z.object({
    note: z.string().describe('text content of note to save.')
  }),
  execute: async ({note}) => {
    notes.push(note);
    return { status: 'success', saved: note, total: notes.length }
  }
})

const listNotes = new FunctionTool({
  name: 'list_notes',
  description: 'Lists every note the user has saved so far. Call this whenever users asks for everything they have saved.',
  execute: async() => {
    return { status: 'success', notes }
  }
})

export const rootAgent = new LlmAgent({
  name: 'note_agent',
  model: 'gemini-3.6-flash',
  description: 'saves and recalls notes of a user.',
  instruction: [
    'You help the user keep notes.',
    'When they tell you to remember something, call the save_note tool.',
    'When they ask you what they have saved, call the list_notes tool.',
    'Never invent notes - only return what list_notes returns.'
  ].join(' '),
  tools: [saveNote, listNotes],
});