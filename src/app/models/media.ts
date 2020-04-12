import { Url } from 'url';

export interface Media {
  url: string;
  pos: 'bottom' | 'top' | 'center';
  ref: string;
  type: 'image' | 'video';
  name?: string;
  metadata?: Promise<{size: number, type: string}>;
}
