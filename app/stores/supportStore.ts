import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Export the interface
export interface SupportFormState {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface SupportAccordionState {
  activeFAQ: number; // Index of the open FAQ item, -1 if none
  activeService: number; // Index of the open Service item, -1 if none
  activeResource: number; // Index of the open Resource item, -1 if none
}

// Interface for message history item
interface MessageHistoryItem {
  subject: string;
  message: string;
  timestamp: number; // Store time as a number (Date.now())
}

// Add messageHistory to the main state interface
interface SupportState extends SupportFormState, SupportAccordionState {
  messageHistory: MessageHistoryItem[];
  setFormField: (field: keyof SupportFormState, value: string) => void;
  setActiveAccordion: (section: keyof SupportAccordionState, index: number) => void;
  addMessageToHistory: (message: Pick<MessageHistoryItem, 'subject' | 'message'>) => void; // Function to add message
  resetForm: () => void;
}

const initialFormState: SupportFormState = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
};

const initialAccordionState: SupportAccordionState = {
  activeFAQ: -1,
  activeService: -1,
  activeResource: -1,
};

export const useSupportStore = create<SupportState>()(
  persist(
    (set) => ({
      ...initialFormState,
      ...initialAccordionState,
      messageHistory: [], // Initialize message history as empty array
      setFormField: (field, value) => set((state) => ({ ...state, [field]: value })),
      setActiveAccordion: (section, index) => set((state) => {
        const currentSectionIndex = state[section];
        return {
          ...state,
          [section]: currentSectionIndex === index ? -1 : index, // Toggle behavior
        };
      }),
      addMessageToHistory: (newMessage) => set((state) => ({
        ...state,
        messageHistory: [
          ...state.messageHistory,
          { ...newMessage, timestamp: Date.now() }
        ]
      })),
      resetForm: () => set(initialFormState),
    }),
    {
      name: 'support-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fullName: state.fullName,
        email: state.email,
        subject: state.subject,
        message: state.message,
        activeFAQ: state.activeFAQ,
        activeService: state.activeService,
        activeResource: state.activeResource,
        messageHistory: state.messageHistory, // Persist message history too
      }),
    }
  )
); 