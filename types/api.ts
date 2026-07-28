export type UserRole = 'USER' | 'EDITOR' | 'ADMIN';
export type ContentStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'HIDDEN';
export type SortOrder = 'asc' | 'desc';
export type PublicationIntent = 'DRAFT' | 'SUBMIT';
export type TargetType = 'POST' | 'REVIEW' | 'COMMENT';
export type CommentTargetType = Exclude<TargetType, 'COMMENT'>;
export type ReactionType = 'LIKE' | 'LOVE' | 'WOW' | 'SAD' | 'ANGRY';
export type PostSource = 'SYSTEM' | 'USER';

export type ResponseMeta = {
  timestamp: string;
  requestId: string;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta: ResponseMeta;
};

export type PaginatedData<T> = {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  hasPassword: boolean;
  oauthProviders: string[];
  createdAt: string;
  updatedAt: string;
};

export type SafeAuthor = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};

export type EntityImage = {
  id: string;
  url: string;
  sourcePageUrl: string;
  altText: string;
  author: string | null;
  licenseName: string;
  licenseUrl: string | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
};

export type Province = {
  id: string;
  name: string;
  slug: string;
  images: EntityImage[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type PlaceSummary = {
  id: string;
  name: string;
  slug: string;
};

export type Place = {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  provinceId: string;
  avgRating: number;
  reviewCount: number;
  status: ContentStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  province: Province;
  categories: Category[];
  images: EntityImage[];
};

export type ReactionCounts = Record<ReactionType, number>;

export type Post = {
  id: string;
  authorId: string;
  placeId: string | null;
  title: string;
  content: string;
  source: PostSource;
  status: ContentStatus;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: SafeAuthor;
  place: PlaceSummary | null;
  commentCount: number;
  reactionCounts: ReactionCounts;
};

export type Review = {
  id: string;
  placeId: string;
  authorId: string;
  rating: number;
  content: string | null;
  status: ContentStatus;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: SafeAuthor;
  place: PlaceSummary;
  commentCount: number;
  reactionCounts: ReactionCounts;
};

export type Comment = {
  id: string;
  authorId: string | null;
  targetType: CommentTargetType;
  targetId: string;
  parentId: string | null;
  content: string | null;
  status: ContentStatus;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: SafeAuthor | null;
  replyCount: number;
  reactionCounts: ReactionCounts;
};

export type Reaction = {
  id: string;
  userId: string;
  targetType: TargetType;
  targetId: string;
  type: ReactionType;
  createdAt: string;
  updatedAt: string;
};

export type ReactionSummary = {
  targetType: TargetType;
  targetId: string;
  total: number;
  counts: ReactionCounts;
};

export type ReactionMutation = {
  outcome: 'CREATED' | 'UNCHANGED' | 'UPDATED';
  reaction: Reaction;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
};

export type RegisterInput = {
  email: string;
  password: string;
  displayName: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type OAuthCodeInput = {
  authorizationCode: string;
  redirectUri: string;
  codeVerifier: string;
};

export type UpdateProfileInput = {
  displayName?: string;
  avatarUrl?: string | null;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type CreatePlaceInput = {
  name: string;
  description: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  provinceId: string;
  categoryIds: string[];
};

export type UpdatePlaceInput = Partial<CreatePlaceInput>;

export type CreatePostInput = {
  title: string;
  content: string;
  placeId?: string;
  publicationIntent: PublicationIntent;
};

export type UpdatePostInput = {
  title?: string;
  content?: string;
  placeId?: string | null;
  publicationIntent?: PublicationIntent;
};

export type CreateReviewInput = {
  rating: number;
  content?: string;
};

export type UpdateReviewInput = {
  rating?: number;
  content?: string | null;
};

export type CreateCommentInput = {
  targetType: CommentTargetType;
  targetId: string;
  parentId?: string;
  content: string;
};

export type UpsertReactionInput = {
  targetType: TargetType;
  targetId: string;
  type: ReactionType;
};
