export type Entry = {
  id: string;
  name: string;
  admissionNumber: string;
  photoUri: string;
  timestamp: number;
};

export type NewEntry = Omit<Entry, 'id' | 'timestamp'>;
