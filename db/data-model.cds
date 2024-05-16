namespace my.bookshop;
using { cuid } from '@sap/cds/common';

entity Books :cuid {
   //key ID : UUID;
  AuthorName   : String;
  title        : String;
  Stock        : Integer;
  AuthorNumber : String;
  address      : Association to  Address;
  bookdetails  : Association to Bookdetails;
}

entity Address :cuid {
  city     : String;
  addresses  : String;
  pincode  : String;
  street   : String;
  landmark : String;

}

entity Bookdetails :cuid{
  PageCount   : Integer;
  PublishedOn : Date;
  genre       : String;
  language    : String;
}
