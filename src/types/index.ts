export interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export interface Meeting {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  location: string;
  price: string; // Formatting as string for display convenience '50,000원'
  tags: string[];
  time?: string;
  ageGroup?: string;
  company?: string;
}
