import { Bayarcash } from '../Bayarcash';

export abstract class Resource {
  protected bayarcash?: Bayarcash;

  constructor(attributes: Record<string, any>, bayarcash?: Bayarcash) {
    this.bayarcash = bayarcash;
    this.fill(attributes);
  }

  /**
   * Fill the resource with attributes
   */
  protected fill(attributes: Record<string, any>): void {
    Object.keys(attributes).forEach((key) => {
      const camelKey = this.camelCase(key);
      (this as any)[camelKey] = attributes[key];
    });
  }

  /**
   * Convert snake_case to camelCase
   */
  protected camelCase(key: string): string {
    const parts = key.split('_');
    return parts
      .map((part, index) => {
        if (index === 0) {
          return part;
        }
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join('');
  }

  /**
   * Transform collection to resource instances
   */
  protected transformCollection<T extends Resource>(
    collection: any[],
    resourceClass: new (data: any, bayarcash?: Bayarcash) => T,
    extraData: Record<string, any> = {}
  ): T[] {
    return collection.map((data) => {
      return new resourceClass({ ...data, ...extraData }, this.bayarcash);
    });
  }
}
