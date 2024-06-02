
sap.ui.define([
    "./BaseController",
    "sap/m/Token",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel"
], function (Controller, Token, Filter, FilterOperator, MessageToast,JSONModel, Device, NotificationListItem,coreLibrary) {
    "use strict";


    return Controller.extend("com.app.libraryapplication.controller.User", {
        onInit: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onCurrentUserDetails, this);
           
        },
        onCurrentUserDetails: function (oEvent) {
            const { userId } = oEvent.getParameter("arguments");
            this.ID = userId;
            const sRouterName = oEvent.getParameter("name");
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

        // aMultiInputs.forEach(function (sId) {
        //     var oMultiInput = oView.byId(sId);
        //     oMultiInput.addValidator(function (args) {
        //         var text = args.text;
        //         return new Token({ key: text, text: text });
        //     });
        // });

        // onGoPress: function () {
        //     var oView = this.getView();

        //     var oISBNFilter = oView.byId("multiInput1"),
        //         oTitleFilter = oView.byId("multiInput2"),
        //         oAuthorFilter = oView.byId("multiInput3"),
        //         oGenreFilter = oView.byId("multiInput4"),
        //         oTable = oView.byId("idBooksTable");

        //     var aFilters = [];
        //     var addFilters = function (oMultiInput, sPath) {
        //         var aTokens = oMultiInput.getTokens();
        //         aTokens.forEach(function (oToken) {
        //             aFilters.push(new Filter(sPath, FilterOperator.EQ, oToken.getKey()));
        //         });
        //     };
        //     addFilters(oISBNFilter, "ISBN");
        //     addFilters(oTitleFilter, "title");
        //     addFilters(oAuthorFilter, "author");
        //     addFilters(oGenreFilter, "genre");

        //     oTable.getBinding("items").filter(aFilters);
        // },

   AllBooks:function(){
    var oRouter = this.getOwnerComponent().getRouter();
    oRouter.navTo("RouteAllBooks");
   }
	
    });
});
