export interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export interface Meeting {
  id: string; // or number, keeping basic for now
  title: string;
  image: string;
  date: string;
  location: string;
  price: number;
  tags: string[];
}
