// Type definitions for the entire application

export interface ServiceCard {
  id: number;
  title: string;
  description: string;
  image: string;
  bgColor: string;
  details: string[];
}

export interface Feature {
  highlight: string;
  text: string;
  img: string;
  reverse: boolean;
  details: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export interface Position {
  x: number;
  y: number;
}