import { Alert } from '../domain/model/alert.entity';

/**
 * AlertAssembler class.
 * Responsable de mapear el JSON puro de la API a entidades de dominio Alert.
 */
export class AlertAssembler {
  /**
   * Mapea el recurso raw a una entidad Alert.
   */
  static toEntityFromResource(resource: any): Alert {
    return new Alert(
      resource.id,
      resource.type,
      resource.description,
      resource.severity,
      resource.date,
      resource.status,
      {
        name: resource.plot?.name || '',
        location: resource.plot?.location || '',
        hectares: resource.plot?.hectares || 0,
      },
    );
  }

  /**
   * Analiza una colección de recursos desde la respuesta HTTP de Angular.
   * (En Angular ya no usamos el objeto response con status de Axios, recibimos el body directamente).
   */
  static toEntitiesFromResponse(responseBody: any | any[]): Alert[] {
    if (!responseBody) {
      console.error('[AlertAssembler] Mapping error: Invalid response body');
      return [];
    }

    const resources = Array.isArray(responseBody) ? responseBody : [responseBody];
    return resources.map((resource) => this.toEntityFromResource(resource));
  }
}
