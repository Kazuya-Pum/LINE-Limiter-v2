export default interface Food {
  id?: string;
  date?: string;
  name: string;
  limit: number;
  notifications: number[];
  place: string;
  category: string;
  memos: string[];
  enabled: boolean;
  img: string;
}
