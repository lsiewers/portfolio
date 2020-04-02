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
  filterComplete?: Array<boolean>;
  metadata: [
    {
      type: 'focus';
      values: Array<string>;
    },
    {
      type: 'purpose',
      values: string
    },
    {
      type: 'tools',
      values: Array<string>;
    },
    {
      type: 'budget',
      values: string
    },
    {
      type: 'client',
      values: Array<string>
    },
    {
      type: 'collaboration',
      values: 'solo' | Array<{
        name: string,
        url?: string
      }>
    },
    {
      type: 'finish date',
      values: Date
    }
  ];
  details: InnerHTML;
}
