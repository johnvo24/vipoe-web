export const API_ROUTES = {
  HOME: "/",
  // Auth
  SIGN_IN: "/v1/auth/login",
  SIGN_UP: "/v1/auth/register",
  VERIFY_EMAIL: "/v1/auth/verify-email",
  // Users
  GET_PROFILE: "/v1/user/profile",
  UPDATE_PROFILE: "/v1/user/profile",
  UPDATE_AVATAR: "/v1/user/profile/avatar",
  // Poem
  CRUD_POEM: "/v1/poem/",
  GET_POEM_FEED: "/v1/poem/feed",
  SEARCH_POEMS: "/v1/poem/search",
  // Collection
  CRUD_COLLECTION: "/v1/collection/",

  // Assistant
  ASSISTANT_CHAT: "/v1/assistant/chat",
}