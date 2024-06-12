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
    loans             : Association to many BooksLoan;
    reservations      : Composition of many Reservation
                            on reservations.bookID = $self;
    userss            : Composition of many Users
                            on userss.books = $self;

}

entity Users {
    key ID            : UUID;
        username      : String;
        password      : String;
        email         : String;
        usertype      : String;
        phoneNumber   : String;
        user_loans    : Composition of many Activeloans on user_loans.user = $self;
        bookLoans     : Composition of many BooksLoan on bookLoans.users = $self;
        books         : Association to Books;


}

entity BooksLoan:cuid {
        users    : Association to Users;
        books    : Association to Books;
        duedate  : Date;
        loandate : Date;
        Active   : Boolean;
        notify:String;
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
