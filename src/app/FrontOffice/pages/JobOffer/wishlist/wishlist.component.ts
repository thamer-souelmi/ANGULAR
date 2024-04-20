import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  currentPage: number = 1; // Current page
  itemsPerPage: number = 4; // Items per page
  constructor(private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit() {
    // Retrieve wishlist from local storage on component initialization
    this.loadWishlist();
  }

  saveWishlist() {
    // Save wishlist to local storage
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  loadWishlist() {
    // Load wishlist from local storage
    const storedWishlist = localStorage.getItem('wishlist');
    this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
  }

  addToWishlist(jobOffer: any) {
    // Add job offer to the wishlist
    this.wishlist.push(jobOffer);
    // Save the updated wishlist to local storage
    this.saveWishlist();
  }

  removeFromWishlist(jobOffer: any) {
    // Remove job offer from the wishlist
    this.wishlist = this.wishlist.filter(item => item !== jobOffer);
    // Save the updated wishlist to local storage
    this.saveWishlist();
    // Show success notification
    this.toastr.warning('Job offer removed from wishlist!', 'Removed');
  }

  clearWishlist() {
    // Check if the wishlist is already empty
    if (this.wishlist.length === 0) {
      // If the wishlist is already empty, show an info notification
      this.toastr.info('Wishlist is already empty!', 'Info');
    } else {
      // Clear the entire wishlist
      this.wishlist = [];
      // Save the updated wishlist to local storage
      this.saveWishlist();
      // Show success notification
      this.toastr.error('Wishlist cleared successfully!', 'Cleared');
    }
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  getPaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.wishlist.slice(startIndex, startIndex + this.itemsPerPage);
  }
  getPaginationNumbers(): number[] {
    const totalPages = Math.ceil(this.wishlist.length / this.itemsPerPage);
    const pagesArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  // Import Math explicitly
  Math = Math;
}
