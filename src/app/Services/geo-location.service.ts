import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class GeoLocationService {
 private locationSubject = new BehaviorSubject<any>({
    loaded: false,
    coordinates: { lat: "", lng: "" },
 });

 location$ = this.locationSubject.asObservable();

 constructor() {
    if (!navigator.geolocation) {
      this.locationSubject.next({
        loaded: true,
        error: {
          code: 0,
          message: "Geolocation not supported",
        },
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.locationSubject.next({
            loaded: true,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error) => {
          this.locationSubject.next({
            loaded: true,
            error: {
              code: error.code,
              message: error.message,
            },
          });
        }
      );
    }
 }
}
