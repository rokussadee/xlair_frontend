export interface Tag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: unknown[]; // Replace with a more specific type if the structure of 'meta' is known
  _links: Links;
}

export interface Links {
  self: LinkItem[];
  collection: LinkItem[];
  about: LinkItem[];
  "wp:post_type": LinkItem[];
  curies: Curie[];
}

export interface LinkItem {
  href: string;
}

export interface Curie {
  name: string;
  href: string;
  templated: boolean;
}

export interface TagsMap {
  [key: number]: string;
}

export interface Post {
  id: number;
  title: { rendered: string };
  date: string;
  acf: {
    start_time: string;
    end_time: string;
    post_image?: number;
    mixcloud_link?: { url?: string };
  };
  tags: number[];
}

export interface Show {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  postImage: number | null;
  mixcloudLink: string | null;
  tags: number[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  imageLink: string | null;
}

export interface WordPressAPIError {
  code: string,
  message: string,
  data: {
    status: string
  }
}

export interface Announcement {
  id: string,
  title: string,
  description: string | null,
  state: boolean,
  startTime: string | null,
  endTime: string | null
}

export interface InvalidResponse {
  code: string,
  message: string,
  data: { status: number }
}
