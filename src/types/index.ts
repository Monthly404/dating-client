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
  aiKeywords?: string[];
  time?: string;
  ageGroup?: string;
  company?: string;
  isOneTime: boolean;
  oneTimeDate?: string; // For one-time meetings: "12.24(토)"
  regularDays?: string[]; // For regular meetings: ["토", "일"]
}
