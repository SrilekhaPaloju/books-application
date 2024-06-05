namespace my.bookshop;

using {cuid} from '@sap/cds/common';

entity Books : cuid {
    ISBN              : String;
    title             : String;
    author            : String;
    quantity          : Integer;
    AvailableQuantity : Integer;
    genre             : String;
    status            : String;
    loans             : Association to many BookLoan;
    reservations      : Composition of many Reservation
                            on reservations.bookID = $self;
    userss            : Composition of many Users
                            on userss.books = $self;

}

entity Users {
    key ID            : UUID;
        username      : String;
        password      : String;
        name          : String;
        email         : String;
        borrowedbooks : Integer;
        usertype      : String;
        user_loans    : Composition of many Activeloans on user_loans.user = $self;
        BookLoans     : Association to one BookLoan;
        books         : Association to Books;


}

entity BookLoan {
    key ID         : UUID;
        bookID     : Association to Books;
        userID     : Association to Users;
        issueDate  : Date;
        dueDate    : Date;
        returnDate : Date;
        status     : String enum {Active;Returned};
        users      : Composition of many Users on users.BookLoans = $self;


}

entity Reservation {
    key ID            : UUID;
        bookID        : Association to Books;
        userID        : Association to Users;
        ReserverdBook : String;
        resevedate    : Date;
}

entity Activeloans : cuid {
    user    : Association to Users;
    dueDate : Date;

}
