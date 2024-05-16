using my.bookshop as my from '../db/data-model';



@path: '/BookSRV'
service CatalogService {
    //  @restrict: [{
    //     grant: '*',
    //     to   : 'Admin'
    // }]
     entity Books as projection on my.Books;
     entity Address as projection on my.Address;
     entity Bookdetails as projection on my.Bookdetails;
     }
        
     


