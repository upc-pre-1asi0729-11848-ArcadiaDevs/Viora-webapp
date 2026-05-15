/**
 * @file iot-device.entity.ts
 * @description Domain entity representing an individual IoT sensor device.
 */

export type IotDeviceId = number | string | null;
export type IotDevicePlotId = number | string | null;
export type IotDeviceStatus = 'active' | 'warning' | 'critical' | 'inactive';

export interface IotDeviceProperties {
  id?: IotDeviceId;
  name?: string;
  plotId?: IotDevicePlotId;
  soilMoisture?: number;
  temperature?: number;
  leafHumidity?: number;
  status?: IotDeviceStatus;
  lastUpdate?: string;
}

export class IotDevice {
  readonly id: IotDeviceId;
  readonly name: string;
  readonly plotId: IotDevicePlotId;
  readonly soilMoisture: number;
  readonly temperature: number;
  readonly leafHumidity: number;
  readonly status: IotDeviceStatus;
  readonly lastUpdate: string;

  /**
   * @param {IotDeviceProperties} params - Entity data.
   * @param {IotDeviceId} [params.id] - Unique identifier.
   * @param {string} [params.name] - Device name.
   * @param {IotDevicePlotId} [params.plotId] - Associated plot ID.
   * @param {number} [params.soilMoisture] - Soil moisture reading.
   * @param {number} [params.temperature] - Temperature reading.
   * @param {number} [params.leafHumidity] - Leaf humidity reading.
   * @param {IotDeviceStatus} [params.status] - Device status.
   * @param {string} [params.lastUpdate] - Last update timestamp.
   */
  constructor({
                id = null,
                name = '',
                plotId = null,
                soilMoisture = 0,
                temperature = 0,
                leafHumidity = 0,
                status = 'active',
                lastUpdate = ''
              }: IotDeviceProperties = {}) {
    this.id = id;
    this.name = name;
    this.plotId = plotId;
    this.soilMoisture = soilMoisture;
    this.temperature = temperature;
    this.leafHumidity = leafHumidity;
    this.status = status;
    this.lastUpdate = lastUpdate;
  }

  get soilMoistureLabel(): string {
    return `${this.soilMoisture}%`;
  }

  get temperatureLabel(): string {
    return `${this.temperature}\u00b0C`;
  }

  get leafHumidityLabel(): string {
    return `${this.leafHumidity}%`;
  }

  get formattedLastUpdate(): string {
    if (!this.lastUpdate) return 'No update';

    const date = new Date(this.lastUpdate);

    if (Number.isNaN(date.getTime())) return 'No update';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  get requiresAttention(): boolean {
    return this.status === 'warning' || this.status === 'critical' || this.soilMoisture < 20;
  }
}