using my.bookshop as my from '../db/data-model';

service CatalogService {
   entity Books as projection on my.Books;
   entity Users as projection on my.Users;
   entity BookLoan as projection on my.BookLoan;
   entity Reservation as projection on my.Reservation;
   entity Activeloans as projection on my.Activeloans;
   } 

