export class BaseApiEndpoint {
  constructor(
    private readonly baseUrl: string,
    private readonly endpointPath: string
  ) {}

  get collectionUrl(): string {
    return `${this.baseUrl}${this.endpointPath}`;
  }

  resourceUrl(id: number | string): string {
    return `${this.collectionUrl}/${id}`;
  }
}
