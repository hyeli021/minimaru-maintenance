const ACCESS_TOKEN_KEY = 'mini-maru:access-token';
const REFRESH_TOKEN_KEY = 'mini-maru:refresh-token';
const TOKEN_CHANGE_EVENT = 'mini-maru:token-change';

export const token = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
  },
  exists: () => Boolean(localStorage.getItem(REFRESH_TOKEN_KEY)),
  subscribe: (onStoreChange: () => void) => {
    window.addEventListener(TOKEN_CHANGE_EVENT, onStoreChange);
    window.addEventListener('storage', onStoreChange);

    return () => {
      window.removeEventListener(TOKEN_CHANGE_EVENT, onStoreChange);
      window.removeEventListener('storage', onStoreChange);
    };
  },
};