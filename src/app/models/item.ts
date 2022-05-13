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
    finishDate: Date,
    links: [
      {
        name: string,
        icon: string,
        url: string
      }
    ]
  };
  details: [
    {
      media?: Media,
      title?: string,
      text: string,
      links?: [
        {
          name: string,
          icon: string,
          url: string
        }?
      ],
      class: 'image--full' | 'image--left' | 'image--right' | 'double--column' | 'quote'
    }
  ];
  filterComplete?: Array<boolean>;
  imageLoaded?: boolean;
  workPreview?: boolean;
  productDescription: string;
  palette: {
    primary: string,
    secondary: string,
    tertiary: string
  }
}
