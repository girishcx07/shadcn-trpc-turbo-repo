export interface Post {
  id: number;
  title: string;
  content: string;
  status: 'published' | 'draft';
}