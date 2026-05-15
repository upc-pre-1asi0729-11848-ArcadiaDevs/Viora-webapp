export abstract class BaseAssembler {
  protected static toEntities<TResource, TEntity>(
    resources: TResource[] = [],
    mapper: (resource: TResource) => TEntity,
  ): TEntity[] {
    return resources.map((resource) => mapper(resource));
  }

  protected static toFirstEntity<TResource, TEntity>(
    resources: TResource[] = [],
    mapper: (resource: TResource) => TEntity,
  ): TEntity | null {
    const firstResource = resources.at(0);

    return firstResource ? mapper(firstResource) : null;
  }
}
