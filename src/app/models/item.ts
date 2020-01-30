export interface Item {
  id: string;
  title: string;
  media: {
    imageUrl: string;
    videoUrl?: string;
    videoPlaying?: boolean;
  };
  filterComplete?: Array<boolean>;
  metadata: [
    {
      type: 'focus';
      value: any;
    },
    {
      type: 'purpose',
      value: string
    },
    {
      type: 'tools',
      value: any;
    },
    {
      type: 'budget',
      value: string
    },
    {
      type: 'client',
      value: any
    },
    {
      type: 'collaboration',
      value: any
    },
    {
      type: 'finish date',
      value: Date
    }
  ];
  details: InnerHTML;
}
