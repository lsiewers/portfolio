export interface Item {
  id: string;
  title: string;
  subtitle: string;
  media: {
    imageUrl: string;
    imagePos: 'bottom' | 'top' | 'center',
    imageRef: string;
    videoUrl?: string;
    videoPlaying?: boolean;
  };
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
  details: InnerHTML;
  filterComplete?: Array<boolean>;
  imageLoaded?: boolean;
  workPreview?: boolean;
}
