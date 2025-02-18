export interface Task {
    id: number;
    userId: number; 
    title: string;
    description?: string;
    isComplete: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface User {
    id: number;
    username: string;
  }
  