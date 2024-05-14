// location.storage.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationStorageService {
  private locationData: any[] = [];

  setLocationData(data: any[]) {
    this.locationData = data;
  }

  getLocationData(): any[] {
    return this.locationData;
  }
}
