export function RefreshAccessToken(token: string) {
  return {
    access: token,
    refresh: token,
  };
}
