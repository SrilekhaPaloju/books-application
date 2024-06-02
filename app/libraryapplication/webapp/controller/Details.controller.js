sap.ui.define([
     "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Element",
    "sap/m/MessageToast",
    "sap/ndc/BarcodeScanner",
    
], function (Controller, JSONModel, MessageToast) {
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
                // ID: "",
                ID: "",
                // userpassword: "",
                books: {
                    // ID: "",
                    // authorName: "",
                    ISBN: "",
                    // quantity: 0
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
        }
        this.oCreateBookDialog.open();
    },
    onCloseCreateDialog: function () {
        if (this.oCreateBookDialog.isOpen()) {
            this.oCreateBookDialog.close()
        }refresh
	},
    // onUpdateButton:async function(){
    //     if (!this.oCreateBookDialog) {
    //         this.oCreateBookDialog = await this.loadFragment("AddBooks") 
    //         var oSelecteditems = this.byId("idBooksTable").getSelectedItems();
    //            }
    //            this.oCreateBookDialog.open();

    // },
    // onCloseUpdateDialog: function(){
    //     if (this.oEditBookDialog.isOpen()) {
    //         this.oEditBookDialog.close()
    //     }
    //},
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

        onCreateBook:async function() {
            // Get the input values from the dialog
            var oView = this.getView();
            var oData = oView.getModel("localModel").getProperty("/");
            var oModel = this.getView().getModel("ModelV2");
            try{
                await this.createData(oModel, oData, "/Books");
                this.getView().byId("idBooksTable").getBinding("items").refresh();
                this.oCreateBookDialog.close();
            }
            catch(error) {
                this.oCreateBookDialog.close();
               MessageToast.show("Some technical Issue");
            }
        },
       onDeleteBook : async function(){
 
        var oSelecteditem = this.byId("idBooksTable").getSelectedItem();
        if (oSelecteditem) {
            var oISBN = oSelecteditem.getBindingContext().getObject().isbn;

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

    onIssueBook:async function() {
            debugger
            var oView1 = this.getView();
            var sUserID = oView1.byId("idUserIDInput").getValue();
           var sISBN = oView1.byId("idISBNIDInput").getValue();
            var sDueDate = oView1.byId("idDueDateInput").getValue();
             var oData1 = oView1.getModel("ActiveloanModel").getProperty("/");
             oData1.user.ID = sUserID;
            oData1.user.books.ISBN = sISBN;
             oData1.dueDate = sDueDate;

            var oModel1 = this.getView().getModel("ModelV2");
                try{
                    await this.createIssue(oModel1, oData1, "/Activeloans");
                    this.getView().byId("idLoanTable").getBinding("items").refresh();
                    this.oCreateBookDialog1.close();
                }
                catch(error) {
                    this.oCreateBookDialog1.close();
                    sap.m.MessageToast.show("Some technical Issue");
                }
        
        },
    onCloseIssueDialog: function() {
        this.getView().byId("idIssueBookDialog").close();
    },
    
    onCloseActiveLoans: function() {
        this.getView().byId("idActiveLoansDailog").close();
    },

    onActiveLoansClick: async function () {
        // debugger
        if (!this.oActiveLoanPopUp) {
            this.oActiveLoanPopUp = await this.loadFragment("ActiveLoans")
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
    onDeleteActiveLoans :function(){
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

    // onUpdateBook: async function(){
    //     var oView2 = this.getView();
    //     var sISBN = oView2.byId("idISBNInput1").getValue();
    //    var sTitle = oView2.byId("idBooktitleInput1").getValue();
    //     var sName = oView2.byId("idAuthorNameInput1").getValue();
    //     var sGenre = oView2.byId("idGenreInput1").getValue();
    //     var sQuan = oView2.byId("idQuantityInput1").getValue();
    //      var oData2 = oView2.getModel("ActiveloanModel1").getProperty("/");
    //      oData2.ISBN = sISBN;
    //     oData2.title = sTitle;
    //      oData2.author = sName;
    //      oData2.quantity = sQuan;
    //      oData2.genre = sGenre;
    //      var oModel2 = this.getView().getModel("ModelV2");
    //             try{
    //                 await this.UpdateBook(oModel2, oData2, "/Books");
    //                 this.getView().byId("idBooksTable").getBinding("items").refresh();
    //                 this.oEditBookDialog.close();
    //             }
    //             catch(error) {
    //                 this.oEditBookDialog.close();
    //                 sap.m.MessageToast.show("Some technical Issue");
    //             }

    // }
    

    });
});
