export interface BaseResource {
  id?: number | string | null;
}

export interface BaseResponse {
  total?: number;
  page?: number;
  limit?: number;
}

export type CollectionResponse<TResource, TKey extends string> =
  | TResource[]
  | (BaseResponse & { [key in TKey]?: TResource[] });

export function extractResourceCollection<TResource, TKey extends string>(
  response: CollectionResponse<TResource, TKey>,
  key: TKey,
): TResource[] {
  return Array.isArray(response) ? response : (response[key] ?? []);
}
