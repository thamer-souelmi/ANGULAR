import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/Services/storage.service';

@Component({
  selector: 'app-all-template-front',
  templateUrl: './all-template-front.component.html',
  styleUrls: ['./all-template-front.component.css']
})
export class AllTemplateFrontComponent {
  constructor(private storageService: StorageService, private router: Router) {}

  ngOnInit() {
    if (!this.storageService.isLoggedIn())
      this.router.navigate(['']);

  }

}
