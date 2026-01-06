export const API_ROUTES = {
  HOME: "/",
  // Auth
  SIGN_IN: "/v1/auth/login",
  SIGN_UP: "/v1/auth/register",
  VERIFY_EMAIL: "/v1/auth/verify-email",
  // Users
  GET_PROFILE: "/v1/user/profile",
  GET_USER_BY_ID: "/v1/user/",
  UPDATE_PROFILE: "/v1/user/profile",
  UPDATE_AVATAR: "/v1/user/profile/avatar",
  CHANGE_PASSWORD: "/v1/user",
  FOLLOW_USER: "/v1/user/follow/",
  UNFOLLOW_USER: "/v1/user/follow/",
  // Poem
  CRUD_POEM: "/v1/poem/",
  GET_POEM_FEED: "/v1/poem/feed",
  GET_ALL_GENRES: "/v1/poem/genres",
  SEARCH_POEMS: "/v1/poem/search",
  LIKE_POEM: "/v1/poem/",
  COMMENT_POEM: "/v1/poem/",
  // Collection
  CRUD_COLLECTION: "/v1/collection/",

  // Assistant
  ASSISTANT_CHAT: "/v1/assistant/chat",
  // Admin User Management
  GET_USERS: "/v1/admin/users/",
  GET_USER: "/v1/admin/users/",
  CREATE_NEW_USER: "/v1/admin/users/",
  UPDATE_USER: "/v1/admin/users/",
  DELETE_USER: "/v1/admin/users/",
}