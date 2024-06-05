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
        onAddButton: async function () {
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
        OnIssueBooks: async function () {
            if (!this.oCreateBookDialog1) {
                this.oCreateBookDialog1 = await this.loadFragment("IssueBook")
                this.oCreateBookDialog = await this.loadFragment("AddBooks")
                this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
            }
            this.oCreateBookDialog1.open();
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

        onIssueBook: async function () {
            debugger
            var oView1 = this.getView();
            var sUserID = oView1.byId("idUserIDInput").getValue();
            var sISBN = oView1.byId("idISBNIDInput").getValue();
            var sDueDate = oView1.byId("idDueDateInput").getValue();
            var oData1 = oView1.getModel("ActiveloanModel").getProperty("/");
            //var sReservationID = oView1.byId("idReserIDInput").getValue();
            oData1.user.ID = sUserID;
            oData1.user.books.ISBN = sISBN;
            oData1.dueDate = sDueDate;
           // oData1.user.books.reservations.ID = sReservationID;

            var oModel1 = this.getView().getModel("ModelV2");
            try {
                await this.createIssue(oModel1, oData1, "/Activeloans");
                this.getView().byId("idLoanTable").getBinding("items").refresh(); 
                this.oCreateBookDialog1.close();
            }
            catch (error) {
                this.oCreateBookDialog1.close();
                sap.m.MessageToast.show("Some technical Issue");
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
        onDeleteActiveLoans: function () {
            var oSelected = this.byId("idLoanTable").getSelectedItem();
            if (oSelected) {
                var oUSerID = oSelected.getBindingContext().getObject().sUserID;

                oSelected.getBindingContext().delete("$auto").then(function () {
                    sap.m.MessageToast.show(" SuccessFully Deleted");
                },
                    function (oError) {
                        sap.m.MessageToast.show("Deletion Error: ", oError);
                    });
                this.getView().byId("idIssueBookDialog").getBinding("items").refresh();

            } else {
                sap.m.MessageToast.show("Please Select a Row to Delete");
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
                var oStatus = oBindingContext.getProperty("status");

                var newBookModel = new sap.ui.model.json.JSONModel({
                    ID: oID,
                    //  ID: oBindingContext.getProperty("ID"), // Assuming you have an ID property
                    author: oAuthor,
                    title: oTitle,
                    quantity: oQuantity,
                    genre: oGenre,
                    ISBN: oISBN,
                    status: oStatus
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

    });
});
