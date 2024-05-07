import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class LocalStorageService {
 private localStorageSubject = new BehaviorSubject<any>(null);

 constructor() {
    // Initialiser le local storage si nécessaire
    if (!localStorage.getItem('attendanceId')) {
      localStorage.setItem('attendanceId', '');
    }
    this.localStorageSubject.next(localStorage.getItem('attendanceId'));
 }

 setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
    this.localStorageSubject.next(localStorage.getItem(key));
 }

 getItem(key: string): any {
    return localStorage.getItem(key);
 }

 removeItem(key: string): void {
    localStorage.removeItem(key);
    this.localStorageSubject.next(localStorage.getItem(key));
 }

 getLocalStorageSubject(): BehaviorSubject<any> {
    return this.localStorageSubject;
 }
}
