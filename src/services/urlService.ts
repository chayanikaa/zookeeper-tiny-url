import baseX from 'base-x';
import getNextNumber from './idService';
import * as UrlDB from '../adapters/UrlDB';

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const bs62 = baseX(BASE62);

const getShortUrl = async () => {
  const idNum = await getNextNumber();
  const shortUrl = bs62.encode([idNum]);
  return shortUrl;
};

export const convertLongUrl = async (longUrl: string) => { 
  return UrlDB.set(await getShortUrl(), longUrl);
}

export const getLongUrl = async (shortUrl: string) => {
  return UrlDB.get(shortUrl);
};
