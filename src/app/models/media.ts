export interface Media {
  url: string;
  pos?: 'bottom' | 'top' | 'center';
  ref: string;
  type?: 'image' | 'video';
  transparentImage?: boolean;
  name?: string;
  metadata?: Promise<{size: number, type: string}>;
}
