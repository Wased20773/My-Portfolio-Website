// ---------- Rich text (Sanity Portable Text, matches blockContent.ts) ----------

export type Span = {
  _key: string;
  _type: "span";
  text: string;
  marks: string[]; // "strong", "em", or a markDef _key (for links)
};

export type LinkMark = {
  _key: string;
  _type: "link";
  href: string;
};

export type Block = {
  _key: string;
  _type: "block";
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
  children: Span[];
  markDefs: LinkMark[];
  listItem?: "bullet";
  level?: number;
};

export type Output =
  | { kind: "error"; message: string }
  | { kind: "ls"; dir: Directory }
  | { kind: "file"; file: FileNode }
  | null;

// ---------- Files ----------

export type AboutMe = {
  _id: string;
  _type: "aboutMe";
  name: string;
  who: string | null;
  what: string | null;
  when: string | null;
  where: string | null;
  why: string | null;
  body: Block[] | null;
};

export type Project = {
  _id: string;
  _type: "project";
  name: string;
  title: string;
  isOngoing: boolean;
  startDate: string | null;
  endDate: string | null;
  tech: string[] | null;
  description: Block[] | null;
};

export type Post = {
  _id: string;
  _type: "post";
  name: string;
  title: string;
  publishedAt: string | null;
  shortDescription: string | null;
  body: Block[] | null;
};

export type FileNode = AboutMe | Project | Post;

// ---------- Folders ----------

export type FolderEntry = {
  name: string;
  cwd: string;
};

export type Directory = {
  name: string;
  cwd: string;
  parent: string | null; // null only for ~
  folders: FolderEntry[];
  files: FileNode[];
};
