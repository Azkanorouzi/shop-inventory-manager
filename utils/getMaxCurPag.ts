import { Request } from "express";

export function getMaxCurPage(req: Request, count: Number) {
  const maxPage = Math.ceil(Number(count) / Number(req.query?.limit ?? 6));
  let curPage = Number(req.query?.page) || 1;

  if (curPage > maxPage) curPage = maxPage;

  return { maxPage, curPage };
}
