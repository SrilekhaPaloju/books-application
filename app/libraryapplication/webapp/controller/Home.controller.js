sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel, Filter, FilterOperator, Fragment) {
        "use strict";

        return Controller.extend("com.app.libraryapplication.controller.Home", {
            onInit: function () {

            },
            // onPress: function () {
            //     debugger;
            //     var oView = this.getView();
            //     var sUserName = oView.byId("_IDGenInput").getValue();
            //     var sPassword = oView.byId("_IDGenInput1").getValue();

            //     if (sUserName === "admin" && sPassword === "Initial") {
            //         // Route to the next page
            //         var oRouter = this.getOwnerComponent().getRouter();
            //      oRouter.navTo("RouteDetails");  // Assuming 'nextPage' is the route name in your manifest.json
            //     } 
            //     else if(sUserName === "user1" && sPassword === "password123"){
            //         var oRouter = this.getOwnerComponent().getRouter();
            //      oRouter.navTo("RouteUser");  
            //     }
            //     else {
            //         // Show an error message
            //         MessageToast.show("Invalid username or password");
            //     }
            //},
            onPress: function () {
                var oView = this.getView();

                var sUserName = oView.byId("_IDGenInput").getValue();
                var sPassword = oView.byId("_IDGenInput1").getValue();

                if (!sUserName || !sPassword) {
                    MessageToast.show("please enter required Credentials");
                    return;
                }

                var oModel = this.getView().getModel();
                var oBinding = oModel.bindList("/Users");

                oBinding.filter([
                    new Filter("username", FilterOperator.EQ, sUserName),
                    new Filter("password", FilterOperator.EQ, sPassword)
                ]);

                oBinding.requestContexts().then(function (aContexts) {  //requestContexts is called to get the contexts (matching records) from the backend.
                    debugger
                    if (aContexts.length > 0) {
                        var ID = aContexts[0].getObject().ID;
                        var userType = aContexts[0].getObject().usertype;
                        if (userType === "Admin") {
                            MessageToast.show("Login Successful");
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteDetails", { userId: ID });
                            var oView = this.getView()
                            oView.byId("_IDGenInput").setValue("");
                            oView.byId("_IDGenInput1").setValue("");
                        }
                        else {
                            MessageToast.show("Login Successful");
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteUser", { userId: ID });
                            var oView = this.getView()
                            oView.byId("_IDGenInput").setValue("");
                            oView.byId("_IDGenInput1").setValue("");
                        }

                    } else {
                        MessageToast.show("Invalid username or password.");
                    }
                }.bind(this)).catch(function () {
                    MessageToast.show("An error occurred during login.");
                });
            }
        })
    })



