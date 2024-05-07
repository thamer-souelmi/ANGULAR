import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
@Component({
  selector: 'app-custom-snack-bar',
  templateUrl: './custom-snack-bar.component.html',
  styleUrls: ['./custom-snack-bar.component.css']
})
export class CustomSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

}
