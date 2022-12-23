import { ParsedUrlQuery } from 'querystring';

export const parseDisplay = (display: string | string[] | undefined) => {
  if (typeof display === 'string') {
    return parseInt(display, 10);
  }
};

export const parsePage = (page: string | string[] | undefined) => {
  if (typeof page === 'string') {
    return parseInt(page, 10);
  }
  return 1;
};

export const parseSize = (size: string | string[] | undefined) => {
  if (typeof size === 'string') {
    return parseInt(size, 10);
  }
  return 50;
};

export const parseQueryParams = (query: ParsedUrlQuery) => {
  return {
    displayId: parseDisplay(query.display),
    page: parsePage(query.page),
    size: parseSize(query.size),
  };
};
