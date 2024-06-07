sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Element",
    "sap/m/MessageToast",
    "sap/ndc/BarcodeScanner",
], function (Controller, JSONModel, MessageToast, ODataModel) {
    "use strict";
    return Controller.extend("com.app.libraryapplication.controller.Details", {
        onInit: function () {
            var oModel = new JSONModel({
                title: "",
                author: "",
                genre: "",
                quantity: "",
            });
            this.getView().setModel(oModel, "localModel");
            this.getView().byId("idBooksTable").getBinding("items");

            var ActiveloanModel = new JSONModel({
                user: {
                    ID: "",
                    books: {
                        ISBN: "",
                    }
                },
                dueDate: ""
            });
            this.getView().setModel(ActiveloanModel, "ActiveloanModel");
        },
        onAddBookButton: async function () {
            if (!this.oCreateBookDialog) {
                this.oCreateBookDialog = await this.loadFragment("AddBooks")
                 this.oCreateBookDialog1 = await this.loadFragment("IssueBook")
                this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
                 this.oEditBooksDialog = await this.loadFragment("Update");
            }
            this.oCreateBookDialog.open();
        },
        onCloseCreateDialog: function () {
            if (this.oCreateBookDialog.isOpen()) {
                this.oCreateBookDialog.close()
            } refresh
        },
        onCloseIssueDialog: function () {
            if (this.oCreateBookDialog1.isOpen()) {
                this.oCreateBookDialog1.close()
            }
        },

        onReservedBooksClick: async function () {
            if (!this.oReserveBookDialog) {
                this.oReserveBookDialog = await this.loadFragment("ReservedBooks")
                this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
                this.oCreateBookDialog = await this.loadFragment("AddBooks")
            }
            this.oReserveBookDialog.open();

        },
        onCloseReserveDialog: function () {
            if (this.oReserveBookDialog.isOpen()) {
                this.oReserveBookDialog.close()
            }
        },

        onCreateBook: async function () {
            // Get the input values from the dialog
            var oView = this.getView();
            var oData = oView.getModel("localModel").getProperty("/");
            if (oData.quantity) {
                oData.AvailableQuantity = oData.quantity;
            }
            var oModel = this.getView().getModel("ModelV2");
            try {
                await this.createData(oModel, oData, "/Books");
                this.getView().byId("idBooksTable").getBinding("items").refresh();
                this.oCreateBookDialog.close();
            }
            catch (error) {
                this.oCreateBookDialog.close();
                MessageToast.show("Some technical Issue");
            }
        },
        onDeleteBook: async function () {

            var oSelecteditem = this.byId("idBooksTable").getSelectedItem();
            if (oSelecteditem) {
                var oISBN = oSelecteditem.getBindingContext().getObject().ISBN;

                oSelecteditem.getBindingContext().delete("$auto").then(function () {
                    sap.m.MessageToast.show(" SuccessFully Deleted");
                },
                    function (oError) {
                        sap.m.MessageToast.show("Deletion Error: ", oError);
                    });
                this.getView().byId("idBooksTable").getBinding("items").refresh();

            } else {
                sap.m.MessageToast.show("Please Select a Row to Delete");
            }
        },

        OnIssueBooks: async function (oEvent) {
            debugger
            var asel = this.byId("idBooksTable").getSelectedItem();
            var oavl_stock = asel.getBindingContext().getProperty("AvailableQuantity")
             
            if(oavl_stock==0){
                sap.m.MessageBox.success("Availability stock is ZERO!!")
            }
            else{
            if (asel) {
                var abooks_ID = asel.getBindingContext().getProperty("ID");
            }
           
            var oSelectedBook = this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject();
            console.log(oSelectedBook);
 
            var oSelectedItem = oEvent.getSource().getParent();
            var oSelectedBook1 = oSelectedItem.getBindingContext()
           
                if (typeof oSelectedBook.AvailableQuantity === 'number') {
                    oSelectedBook.AvailableQuantity = Math.max(0, oSelectedBook.AvailableQuantity - 1);
                               
                    // Update the avl_stock value in the "Books" entity set
                  delete oSelectedBook['@$ui5.context.isSelected'];
                    var oModel = this.getView().getModel("ModelV2");
                    try {
                        await oModel.update("/Books(" + oSelectedBook.ID + ")", oSelectedBook);
                        this.byId("idBooksTable").getBinding("items").refresh();
                        console.log("success")
                    } catch (error) {
                        console.error("Error updating book AvailableQuantity:", error);
                    }
                }
           
   
            var currentDate = new Date();

            // Format the current date
            var year = currentDate.getFullYear();
            var month = String(currentDate.getMonth() + 1).padStart(2, '0');
            var day = String(currentDate.getDate()).padStart(2, '0');
            var formattedDate = year + '-' + month + '-' + day;
           
            // Add 20 days to the current date
            currentDate.setDate(currentDate.getDate() + 15);
           
            // Get the year, month, and day components after adding 20 days
            var yearAfter20Days = currentDate.getFullYear();
            var monthAfter20Days = String(currentDate.getMonth() + 1).padStart(2, '0');
            var dayAfter20Days = String(currentDate.getDate()).padStart(2, '0');
           
            // Format the date after adding 20 days in "yyyy-mm-dd" format
            var formattedDateAfter20Days = yearAfter20Days + '-' + monthAfter20Days + '-' + dayAfter20Days;

            var newLoanModel = new sap.ui.model.json.JSONModel({
                users_ID: " ",
                books_ID: abooks_ID,
                duedate: formattedDateAfter20Days,
                loandate: formattedDate,
                Active: true,
               

            });
            this.getView().setModel(newLoanModel, "newLoanModel")

            if (!this.oIssueBooksDialog) {
                this.oIssueBooksDialog = await this.loadFragment("IssueBook"); // Load your fragment asynchronously
            }

            this.oIssueBooksDialog.open();
        }
        },
        onIssueBook: async function () {
                const oPayload = this.getView().getModel("newLoanModel").getProperty("/");
           
                const oModel = this.getView().getModel("ModelV2");
 
                try {
                    // Attempt to create data
                    await this.createData(oModel, oPayload, "/BooksLoan");
               
                    // If successful, refresh the binding of the items associated with user loans
                    var userLoansControl = this.getView().byId("idLoanTable");
               
                        console.log("Dialog:", this.oIssueBooksDialog); // Check if the dialog object is correctly referenced
                        this.oIssueBooksDialog.close(); // Attempt to cl
                        sap.m.MessageBox.success("Book Issued Successfully")
                        this.getView().byId("idLoanTable").getBinding("items").refresh();
                        
                    }  
                catch (error) {
                    // Handle the error
                    console.error("Error occurred while saving:", error);
               
                    // Display a user-friendly error message
                    sap.m.MessageBox.error("Failed to save the data. Please try again later.");
                    console.log("Dialog:", this.oIssueBooksDialog); // Check if the dialog object is correctly referenced
this.oIssueBooksDialog.close(); // Attempt to cl
                }
        },
        onCloseIssueDialog: function () {
            this.getView().byId("idIssueBookDialog").close();
        },

        onCloseActiveLoans: function () {
            this.getView().byId("idActiveLoansDailog").close();
        },

        onActiveLoansClick: async function () {
            // debugger
            if (!this.oActiveLoanPopUp) {
                this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
                this.oReserveBookDialog = await this.loadFragment("ReservedBooks")
                this.oCreateBookDialog = await this.loadFragment("AddBooks")

            }
            this.oActiveLoanPopUp.open();
        },
        onCloseActiveLoans: function () {
            // debugger;
            // this.byId("idActiveLoansTable").close();
            if (this.oActiveLoanPopUp.isOpen()) {
                this.oActiveLoanPopUp.close();
            }
        },
        onUpdateButton: async function () {
            var oSelected = this.byId("idBooksTable").getSelectedItems();
            if (oSelected.length > 0) {
                // Assuming you only want to update the first selected item
                var oItem = oSelected[0];

                var oBindingContext = oItem.getBindingContext();
                var oID = oBindingContext.getProperty("ID");
                var oISBN = oBindingContext.getProperty("ISBN");
                var oTitle = oBindingContext.getProperty("title");
                var oAuthor = oBindingContext.getProperty("author");
                var oQuantity = oBindingContext.getProperty("quantity");
                var oGenre = oBindingContext.getProperty("genre");
                var oAquan = oBindingContext.getProperty("AvailableQuantity");

                var newBookModel = new sap.ui.model.json.JSONModel({
                    ID: oID,
                    //  ID: oBindingContext.getProperty("ID"), // Assuming you have an ID property
                    author: oAuthor,
                    title: oTitle,
                    quantity: oQuantity,
                    genre: oGenre,
                    ISBN: oISBN,
                    AvailableQuantity: oAquan
                });
                this.getView().setModel(newBookModel, "newBookModel");

                if (!this.oEditBooksDialog) {
                    this.oEditBooksDialog = await this.loadFragment("Update");
                    this.oCreateBookDialog = await this.loadFragment("AddBooks")
                }

                this.oEditBooksDialog.open();
            } else {
                // Handle the case when no items are selected
                sap.m.MessageToast.show("Please select a book to update.");
            }
        },
        onCloseUpdateDialog: function () {
            if (this.oEditBooksDialog.isOpen()) {
                this.oEditBooksDialog.close()
            }
        },
        onUpdateBook: function () {
            var oPayload = this.getView().getModel("newBookModel").getData();
            var oDataModel = this.getOwnerComponent().getModel("ModelV2");// Assuming this is your OData V2 model
            console.log(oDataModel.getMetadata().getName());

            try {
                // Assuming your update method is provided by your OData V2 model
                oDataModel.update("/Books(" + oPayload.ID + ")", oPayload, {
                    success: function () {
                        this.getView().byId("idBooksTable").getBinding("items").refresh();
                        this.oEditBooksDialog.close();
                    }.bind(this),
                    error: function (oError) {
                        this.oEditBooksDialog.close();
                        sap.m.MessageBox.error("Failed to update book: " + oError.message);
                    }.bind(this)
                });
            } catch (error) {
                this.oEditBooksDialog.close();
                sap.m.MessageBox.error("Some technical Issue");
            }

        },
        onDeleteReserveDialog: function () {
            var oSelected = this.byId("idReserveTable").getSelectedItem();
            if (oSelected) {
                var oUSerID = oSelected.getBindingContext().getObject().sUserID;

                oSelected.getBindingContext().delete("$auto").then(function () {
                    sap.m.MessageToast.show(" SuccessFully Deleted");
                },
                    function (oError) {
                        sap.m.MessageToast.show("Deletion Error: ", oError);
                    });
                this.getView().byId("idReserveBooksDailog").getBinding("items").refresh();

            } else {
                sap.m.MessageToast.show("Please Select a Row to Delete");
            }
        },
        // onDeleteActiveLoans: function () {
        //     var oSelected = this.byId("idLoanTable").getSelectedItem();
        //     if (oSelected) {
        //         var oUSerID = oSelected.getBindingContext().getObject().sUserID;

        //         oSelected.getBindingContext().delete("$auto").then(function () {
        //             sap.m.MessageToast.show(" SuccessFully Deleted");
        //         },
        //             function (oError) {
        //                 sap.m.MessageToast.show("Deletion Error: ", oError);
        //             });
        //         this.getView().byId("idIssueBookDialog").getBinding("items").refresh();

        //     } else {
        //         sap.m.MessageToast.show("Please Select a Row to Delete");
        //     }
            
        // },

        // onDeleteActiveLoans:async function(){
        //     var osel = this.byId("idLoanTable").getSelectedItem().getBindingContext().getObject();
            
        //     // var osel = this.byId("idReservedBooksPageTable").getSelectedItem().getBindingContext().getObject();
        //     console.log(osel);
  
        //     // var oSelectedItem = oEvent.getSource().getParent();
        //     // var oSelectedBook1 = oSelectedItem.getBindingContext().getObject();
  
            
        //         if (typeof osel.books.AvailableQuantity === 'number') {
        //             osel.books.AvailableQuantity = Math.max(0, osel.books.AvailableQuantity + 1);
  
        //             // Update the AvailableQuantity value in the "Books" entity set
        //             var oModel = this.getView().getModel("ModelV2");
        //             try {
        //                 await oModel.update("/Books(" + osel.books.ID + ")", osel.books);
        //             } catch (error) {
        //                 console.error("Error updating book AvailableQuantity:", error);
        //             }
        //         } else {
        //             console.error("Quantity is not a number.");
        //         }

        //     const newUserLoans = new sap.ui.model.json.JSONModel({
        //       ID:osel.ID,
        //       books_ID:osel.books.ID,
        //       users_ID:osel.users.ID,
        //     //  Active: false,
  
        //     });
  
        //     this.getView().setModel(newUserLoans, "newUserLoans");
        //     const oPayload = this.getView().getModel("newUserLoans").getData()
        //             oModel = this.getView().getModel("ModelV2");
        //             try {
        //               // Assuming your update method is provided by your OData V2 model
        //               oModel.update("/BooksLoan(" + oPayload.ID + ")", oPayload, {
        //                   success: function() {
        //                       this.getView().byId("idLoanTable").getBinding("items").refresh();
        //                       sap.m.MessageBox.success("Loan closed Successfully!!!");
        //                       // this.oEditBooksDialog.close();
        //                   }.bind(this),
        //                   error: function(oError) {
        //                       // this.oEditBooksDialog.close();
        //                       sap.m.MessageBox.error("Failed to update book: " + oError.message);
        //                   }.bind(this)
        //               });
        //           } catch (error) {
        //               // this.oEditBooksDialog.close();
        //               sap.m.MessageBox.error("Some technical Issue");
        //           }
        //           var oModel = new sap.ui.model.odata.v2.ODataModel({
        //               serviceUrl: "https://port4004-workspaces-ws-466sw.us10.trial.applicationstudio.cloud.sap/v2/odata/v4/catalog/$metadata",
        //               defaultBindingMode: sap.ui.model.BindingMode.TwoWay,
        //               // Configure message parser
        //               messageParser: sap.ui.model.odata.ODataMessageParser
        //           })  
      
        //         }

        onDeleteActiveLoans: async function () {
            var oSelected = this.byId("idLoanTable").getSelectedItem();
        
            if (!oSelected) {
                sap.m.MessageToast.show("Please select a row to delete");
                return;
            }
        
            var oContext = oSelected.getBindingContext();
            var oLoan = oContext.getObject();
            var sBookID = oLoan.books.ID;
            var oModel = this.getView().getModel("ModelV2");
        
            console.log("Selected Loan:", oLoan);
        
            // Update the available quantity of the book
            if (typeof oLoan.books.AvailableQuantity === 'number') {
                oLoan.books.AvailableQuantity += 1;
        
                try {
                    await oModel.update(`/Books(${sBookID})`, {
                        AvailableQuantity: oLoan.books.AvailableQuantity
                    });
                   // sap.m.MessageToast.show("Book quantity updated successfully");
                } catch (error) {
                    console.error("Error updating book available quantity:", error);
                    sap.m.MessageBox.error("Error updating book available quantity: " + error.message);
                    return;
                }
            } else {
                console.error("Available quantity is not a number.");
                sap.m.MessageBox.error("Available quantity is not a number.");
                return;
            }
        
            // Delete the loan entry
            try {
                await oContext.delete("$auto");
                this.getView().byId("idLoanTable").getBinding("items").refresh();
                sap.m.MessageToast.show("Loan closed successfully");
            } catch (error) {
                console.error("Error deleting loan:", error);
                sap.m.MessageBox.error("Error deleting loan: " + error.message);
            }
        }
        
         });
});
