const urls: Record<string, string> = {};

export const get = async (shortUrl: string) => {
  return urls[shortUrl];
};

export const set = async (shortUrl: string, longUrl: string) => {
  urls[shortUrl] = longUrl;
  return shortUrl;
};