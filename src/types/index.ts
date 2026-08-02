export type BookStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED';

export interface BookType {
  _id: string;
  userId: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
}

export interface BookStats {
  total: number;
  wantToRead: number;
  reading: number;
  completed: number;
  completionPercentage: number;
}