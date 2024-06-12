sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/library",
    "sap/ui/Device",
    "sap/m/NotificationListItem",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller, JSONModel, ODataModel, Filter, FilterOperator, MessageBox, MessageToast, coreLibrary, Device, NotificationListItem,) {
    "use strict";

    var Priority = coreLibrary.Priority;

    return Controller.extend("com.app.libraryapplication.controller.AllBooks", {
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onCurrentUserDetails, this);
            this.getView().byId("idBooksTable").getBinding("items").refresh()

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
        onCurrentUserDetails: function (oEvent) {
            const { id } = oEvent.getParameter("arguments");
            this.ID = id;
            // const sRouterName = oEvent.getParameter("name");
            const oForm = this.getView().byId("idBooksListPage");
            oForm.bindElement(`/Users(${id})`, {
                expand: ''
            });
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
        onReserveBook: async function (oEvent) {
            var oSelectedItem = oEvent.getSource();
           // console.log(oSelectedItem)
           // console.log(this.ID)
            console.log(oEvent.getSource().getParent())
            var userId = this.ID
            if (this.byId("idBooksTable").getSelectedItems().length > 1) {
              MessageToast.show("Please Select only one Book");
              return
            }
            var oSelectedBook = this.byId("idBooksTable").getSelectedItem().getBindingContext().getObject()
     
            const userModel = new sap.ui.model.json.JSONModel({
              userID_ID: userId,
              bookID_ID: oSelectedBook.ID,
              resevedate: new Date(),
            });
            this.getView().setModel(userModel, "userModel");
     
            const oPayload = this.getView().getModel("userModel").getProperty("/"),
              oModel = this.getView().getModel("ModelV2");
     
            try {
              await this.createData(oModel, oPayload, "/Reservation");
              MessageBox.success("Book Reserved");
            } catch (error) {
              //this.oCreateBooksDialog.close();
              MessageBox.error("Some technical Issue");
            }
          }

    });
});
