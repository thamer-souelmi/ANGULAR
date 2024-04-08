import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: any[] = [];
  currentPage: number = 1; // Current page
  itemsPerPage: number = 4; // Items per page

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
  }

  clearWishlist() {
    // Clear the entire wishlist
    this.wishlist = [];
    // Save the updated wishlist to local storage
    this.saveWishlist();
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
