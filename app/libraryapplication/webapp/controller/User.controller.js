
sap.ui.define([
    "./BaseController",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel"
], function (Controller) {
    "use strict";


    return Controller.extend("com.app.libraryapplication.controller.User", {
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onCurrentUserDetails, this);

        },
        onCurrentUserDetails: function (oEvent) {
            const { userId } = oEvent.getParameter("arguments");
            this.ID = userId;
            // const sRouterName = oEvent.getParameter("name");
            const oForm = this.getView().byId("idBooksListPage");
            oForm.bindElement(`/Users(${userId})`, {
                expand: ''
            });
        },

        onClearFilterPress: function () {
            var oView = this.getView();
            var aMultiInputs = ["multiInput1", "multiInput2", "multiInput3", "multiInput4"];

            aMultiInputs.forEach(function (sId) {
                var oMultiInput = oView.byId(sId);
                oMultiInput.setTokens([]);
            });
        },
        AllBooks: function () {
            const userID = this.ID
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteAllBooks", {
                id: userID
            });
        }
    });
});
