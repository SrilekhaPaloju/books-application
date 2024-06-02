// sap.ui.define([
//     "./BaseController",
//    "sap/ui/model/json/JSONModel",
//    "sap/m/Token",
//    "sap/ui/model/Filter",
//    "sap/ui/model/FilterOperator",
//    "sap/ui/core/Element",
//    "sap/m/MessageBox"
   
// ], function (Controller, JSONModel, MessageBox, Token, Filter, FilterOperator, ) {
//    "use strict";

//    return Controller.extend("com.app.libraryapplication.controller.AllBooks", {
//     onInit: function () {
//        const oView = this.getView(),
//                     oMulti1 = this.oView.byId("multiInput1"),
//                     oMulti2 = this.oView.byId("multiInput2"),
//                     oMulti3 = this.oView.byId("multiInput3"),
//                     oMulti4 = this.oView.byId("multiInput4");
//         let validae = function (arg) {
//             if (true) {
//                 var text = arg.text;
//                 return new sap.m.Token({ key: text, text: text });
//             }
//         }
//         oMulti1.addValidator(validae);
//         oMulti2.addValidator(validae);
//         oMulti3.addValidator(validae);
//         oMulti4.addValidator(validae);
//     },
    
//     onGoPress: function () {
//           //  const oView = this.getView(),
//             oISBN = oView.byId("multiInput1"),
//             sISBN = oISBN.getTokens(),
//             oTitle = oView.byId("multiInput2"),
//             sTitle = oTitle.getTokens(),
//             oAuthor = oView.byId("multiInput3"),
//             sAuthor = oAuthor.getTokens(),
//             oGenre = oView.byId("multiInput4"),
//             sGnere = oGenre.getTokens(),
//             oTable = oView.byId("idBooksTable"),
//             aFilters = [];

//         // passing the multitokens

//         sISBN.filter((ele) => {
//             ele ? aFilters.push(new Filter("ISBN", FilterOperator.EQ, ele.getKey())) : " ";
//         })
//         sTitle.forEach(ele => {
//             if (ele) {
//                 aFilters.push(new Filter("title", FilterOperator.EQ, ele.getKey()));
//             }
//         });

//         sAuthor.filter((ele) => {
//             ele ? aFilters.push(new Filter("author", FilterOperator.EQ, ele.getKey())) : " ";
//         })

//         sGnere.filter((ele) => {
//             ele ? aFilters.push(new Filter("genre", FilterOperator.EQ, ele.getKey())) : " ";
//         })
//         oTable.getBinding("items").filter(aFilters);
//     },
//     onClearFilterPress: function () {
//         const oView = this.getView(),
//         oISBN = oView.byId("multiInput1").destroyTokens(),
//         oTitle = oView.byId("multiInput2").destroyTokens(),
//         oAuthor = oView.byId("multiInput3").destroyTokens();
//     },

//         onReserveBook: function() {
//             var selectedBook = this.getView().byId("idBooksTable").getSelectedItem();
//             if (!selectedBook) {
//                 sap.m.MessageBox.error("Please select a book to reserve.");
//                 return;
//             }

//             var bookTitle = selectedBook.getBindingContext().getObject().title;
//             var bookStatus = selectedBook.getBindingContext().getObject().status;

//             if (bookStatus === "Reserved") {
//                 sap.m.MessageBox.information("The book '" + bookTitle + "' is already Reserved.");
//             } else {
//                 sap.m.MessageBox.success("You have successfully reserved the book '" + bookTitle + "'.");
//             }
//         },
// });
// });





sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], function (Controller, JSONModel, Token, Filter, FilterOperator, MessageBox) {
    "use strict";

    return Controller.extend("com.app.libraryapplication.controller.AllBooks", {
        onInit: function () {
            const oView = this.getView(),
                oMulti1 = oView.byId("multiInput1"),
                oMulti2 = oView.byId("multiInput2"),
                oMulti3 = oView.byId("multiInput3"),
                oMulti4 = oView.byId("multiInput4");

            let validate = function (arg) {
                if (true) {
                    var text = arg.text;
                    return new sap.m.Token({ key: text, text: text });
                }
            };

            oMulti1.addValidator(validate);
            oMulti2.addValidator(validate);
            oMulti3.addValidator(validate);
            oMulti4.addValidator(validate);
        },

        onGoPress: function () {
            const oView = this.getView(),
                oISBN = oView.byId("multiInput1"),
                sISBN = oISBN.getTokens(),
                oTitle = oView.byId("multiInput2"),
                sTitle = oTitle.getTokens(),
                oAuthor = oView.byId("multiInput3"),
                sAuthor = oAuthor.getTokens(),
                oGenre = oView.byId("multiInput4"),
                sGenre = oGenre.getTokens(),
                oTable = oView.byId("idBooksTable"),
                aFilters = [];

            // Add filters based on the tokens
            sISBN.forEach((ele) => {
                if (ele) {
                    aFilters.push(new Filter("ISBN", FilterOperator.EQ, ele.getKey()));
                }
            });
            sTitle.forEach((ele) => {
                if (ele) {
                    aFilters.push(new Filter("title", FilterOperator.EQ, ele.getKey()));
                }
            });
            sAuthor.forEach((ele) => {
                if (ele) {
                    aFilters.push(new Filter("author", FilterOperator.EQ, ele.getKey()));
                }
            });
            sGenre.forEach((ele) => {
                if (ele) {
                    aFilters.push(new Filter("genre", FilterOperator.EQ, ele.getKey()));
                }
            });

            oTable.getBinding("items").filter(aFilters);
        },

        onClearFilterPress: function () {
            const oView = this.getView(),
                oISBN = oView.byId("multiInput1"),
                oTitle = oView.byId("multiInput2"),
                oAuthor = oView.byId("multiInput3"),
                oGenre = oView.byId("multiInput4"),
                oTable = oView.byId("idBooksTable");

            // Clear tokens
            oISBN.destroyTokens();
            oTitle.destroyTokens();
            oAuthor.destroyTokens();
            oGenre.destroyTokens();

            // Clear filters and refresh the table
            oTable.getBinding("items").filter([]);
        },

        onReserveBook: function () {
            var selectedBook = this.getView().byId("idBooksTable").getSelectedItem();
            if (!selectedBook) {
                sap.m.MessageBox.error("Please select a book to reserve.");
                return;
            }

            var bookTitle = selectedBook.getBindingContext().getObject().title;
            var bookStatus = selectedBook.getBindingContext().getObject().status;

            if (bookStatus === "Reserved") {
                sap.m.MessageBox.information("The book '" + bookTitle + "' is already Reserved.");
            } else {
                sap.m.MessageBox.success("You have successfully reserved the book '" + bookTitle + "'.");
            }
        }
    });
});
