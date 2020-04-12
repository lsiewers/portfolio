import { Media } from './media';

export interface Item {
  id: string;
  title: string;
  subtitle: string;
  header: Media;
  metadata: {
    focus: Array<string>,
    purpose: string,
    tools: Array<string>,
    budget: string,
    client: Array<string>,
    collaboration: Array<{
      name: string,
      url?: string
    }>,
    finishDate: Date
  };
  details: string;
  filterComplete?: Array<boolean>;
  imageLoaded?: boolean;
  workPreview?: boolean;
}
