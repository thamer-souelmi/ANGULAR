// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/Services/user.service';
import * as L from 'leaflet';
import axios from 'axios';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentDateTime: string = '';
  totalUsers: number = 0;
  userChangePercentage: number = 0;
  timezone: string = '';
  private centroid : L.LatLngExpression = [42.3601,-71.0589]
  
  

  constructor(private datePipe: DatePipe, private userService: UserService) {}
  private map!: L.Map;
  ngOnInit() {
    const tunisianAddresses = [
      { name: 'Tunis City Hall', lat: 36.8065, lon: 10.1815 },
      { name: 'Sidi Bou Said', lat: 36.8708, lon: 10.3363 },
      { name: 'Carthage Ruins', lat: 36.8588, lon: 10.3294 }
    ];
    this.updateCurrentTime();
    this.getTimezone();
    this.fetchUserStatistics();
    const map = L.map('map').setView([36.8065, 10.1815], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add markers for each address
    tunisianAddresses.forEach(address => {
      L.marker([address.lat, address.lon]).addTo(map)
        .bindPopup(address.name);
    });
    
    
        this.userService.findAllUsers().subscribe((user: any) => {
          const address = user.address; // Assuming user object has an 'address' property
    
          // Use geocoding service to convert address to coordinates
          axios.get('https://api.openstreetmap.org/search?format=json&q=' + encodeURIComponent(address))
            .then((response) => {
              const results = response.data;
              if (results.length > 0) {
                const { lat, lon } = results[0];
                L.marker([lat, lon]).addTo(this.map)
                  .bindPopup('User Address: ' + address)
                  .openPopup();
              } else {
                console.error('No results found for the address:', address);
              }
            })
            .catch((error) => {
              console.error('Error fetching coordinates:', error);
            });
        });
      }
    
  
  
  
  

  updateCurrentTime() {
    const currentDate: Date = new Date();
    const formattedDate: string | null = this.datePipe.transform(currentDate, 'short');
    this.currentDateTime = formattedDate ?? '';
  }

  getTimezone() {
    const currentDate: Date = new Date();
    const offset: number = currentDate.getTimezoneOffset() / 60;
    const sign: string = offset > 0 ? '-' : '+';
    const hours: string = Math.abs(offset).toString().padStart(2, '0');
    const minutes: string = '00';
    this.timezone = `(GMT${sign}${hours}:${minutes})`;
  }

  fetchUserStatistics() {
    this.userService.getUserStatistics().subscribe((data: any) => {
      this.totalUsers = data;
    });
  }
}
