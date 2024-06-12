sap.ui.define([
    "./BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, MessageToast, JSONModel, Filter, FilterOperator, Fragment) {
        "use strict";

        return Controller.extend("com.app.libraryapplication.controller.Home", {
            onInit: function () {
               var oModel1 = new ODataModel("/v2/odata/v4/catalog/");
               this.getView().setModel(oModel1);
                const oLocalModel = new JSONModel({
                    username: "",
                    password: "",
                    email: "",
                    phoneNumber: "",
                    usertype: "user"
                });
                this.getView().setModel(oLocalModel, "localModel");

            },
            // onPress: function () {
            //     var oView = this.getView();
                
            //     var sUserName = oView.byId("_IDLoginGenInput").getValue();
            //     var sPassword = oView.byId("_IDGenLoginInput1").getValue();

            //     if (!sUserName || !sPassword) {
            //         MessageToast.show("please enter required Credentials");
            //         return;
            //     }

            //     var oModel = this.getView().getModel();
            //     var oBinding = oModel.bindList("/Users");

            //     oBinding.filter([
            //         new Filter("username", FilterOperator.EQ, sUserName),
            //         new Filter("password", FilterOperator.EQ, sPassword)
            //     ]);

            //     oBinding.requestContexts().then(function (aContexts) {  //requestContexts is called to get the contexts (matching records) from the backend.
            //         debugger
            //         if (aContexts.length > 0) {
            //             var ID = aContexts[0].getObject().ID;
            //             var userType = aContexts[0].getObject().usertype;
            //             if (userType === "Admin") {
            //                 sap.m.MessageToast.show("Login Successful");
            //                 var oRouter = this.getOwnerComponent().getRouter();
            //                 oRouter.navTo("RouteDetails", { userId: ID });
            //                 var oView = this.getView()
            //                 oView.byId("_IDLoginGenInput").setValue("");
            //                 oView.byId("_IDLoginGenInput1").setValue("");
            //             }
            //             else {
            //                 sap.m.MessageToast.show("Login Successful");
            //                 var oRouter = this.getOwnerComponent().getRouter();
            //                 oRouter.navTo("RouteUser", { userId: ID });
            //                 var oView = this.getView()
            //                 oView.byId("_IDLoginGenInput").setValue("");
            //                 oView.byId("_IDLoginGenInput1").setValue("");
            //             }

            //         } else {
            //             sap.m.MessageToast.show("Invalid username or password.");
            //         }
            //     }.bind(this)).catch(function () {
            //         sap.m.MessageToast.show("An error occurred during login.");
            //     });
            //},
            onSignUpButton: async function(){
                if (!this.oSignUpDialog) {
                    this.oSignUpDialog = await this.loadFragment("SignUp")
                }
                this.oSignUpDialog.open();
            },
            onCloseSignUpDialog: function () {
                if (this.oSignUpDialog.isOpen()) {
                    this.oSignUpDialog.close()
                } 
            },
            onLoginperss:async function(){
                if (!this.oLoginDialog) {
                    this.oLoginDialog = await this.loadFragment("Login")
                }
                this.oLoginDialog.open();
            },
            onCloseLoginDialog: function () {
                if (this.oLoginDialog.isOpen()) {
                    this.oLoginDialog.close()
                } 
            },
            signupBtnClick: async function(){
                const oPayload = this.getView().getModel("localModel").getProperty("/"),
                oModel1 = this.getView().getModel("ModelV2");
            // oPayload.read{

            // }
            if (oPayload.username && oPayload.password) {

            }
            else {
                sap.m.MessageBox.error("Please enter valid userName and Password");
                return
            }
            var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            var phoneRegex=/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/
            if(!(emailRegex.test(oPayload.email)&&phoneRegex.test(oPayload.phoneNumber))){
                MessageToast.show("please enter valid email and password")
                return
            }
            try {
                var oTitleExist = await this.checkUserName(oModel1, oPayload.username, oPayload.password)
                var OemailCheck=await this.checkEmail(oModel1,oPayload.email)
                var oPhoneCheck=await this.checkPhone(oModel1,oPayload.phoneNumber)
                if (oTitleExist) {
                    MessageToast.show("User already exsist")
                    return
                }
                if(OemailCheck){
                    MessageToast.show("Email already exsist for another user please enter vaild email ")
                    return
                }
                if(oPhoneCheck){
                    MessageToast.show("PhoneNumber already exsist for another user please enter valid Phonenumber")
                    return
                }
                await this.createData(oModel1, oPayload, "/Users");
                // this.getView().byId("idBooksTable").getBinding("items").refresh();
                MessageToast.show("Registration Successfull");
                this.oSignUpDialog.close();
            } catch (error) {
                this.oSignUpDialog.close();
                sap.m.MessageBox.error("Some technical Issue");
            }
        },
        checkUserName: async function (oModel1, sUserName, sPassword) {
            return new Promise((resolve, reject) => {
                oModel1.read("/Users", {
                    filters: [
                        new Filter("username", FilterOperator.EQ, sUserName),
                        //new Filter("password", FilterOperator.EQ, sPassword)

                    ],
                    success: function (oData) {
                        resolve(oData.results.length > 0);
                    },
                    error: function () {
                        reject(
                            "An error occurred while checking username existence."
                        );
                    }
                })
            })
        },
        checkEmail: async function (oModel1, semail) {
            return new Promise((resolve, reject) => {
                oModel1.read("/Users", {
                    filters: [
                        new Filter("email", FilterOperator.EQ, semail),
                        //new Filter("password", FilterOperator.EQ, sPassword)

                    ],
                    success: function (oData) {
                        resolve(oData.results.length > 0);
                    },
                    error: function () {
                        reject(
                            "An error occurred while checking username existence."
                        );
                    }
                })
            })
        },
        checkPhone: async function (oModel1, sPhone) {
            return new Promise((resolve, reject) => {
                oModel1.read("/Users", {
                    filters: [
                        new Filter("phoneNumber", FilterOperator.EQ, sPhone),
                        //new Filter("password", FilterOperator.EQ, sPassword)

                    ],
                    success: function (oData) {
                        resolve(oData.results.length > 0);
                    },
                    error: function () {
                        reject(
                            "An error occurred while checking username existence."
                        );
                    }
                })
            })
        },
        onPress: function () {

            var oView = this.getView();

            var sUsername = oView.byId("_IDLoginGenInput").getValue();  //get input value data in oUser variable
            var sPassword = oView.byId("_IDGenLoginInput1").getValue();    //get input value data in oPwd variable

            if (!sUsername || !sPassword) {
                MessageToast.show("please enter username and password.");
                return
            }

            var oModel = this.getView().getModel();
            oModel.read("/Users", {
                filters: [
                    new Filter("username", FilterOperator.EQ, sUsername),
                    new Filter("password", FilterOperator.EQ, sPassword)

                ],
                success: function (oData) {
                    if (oData.results.length > 0) {
                        var ID = oData.results[0].ID;
                        var usertype = oData.results[0].usertype;
                        MessageToast.show("Login Successful");
                        if (usertype === "Admin") {
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteDetails", { userId: ID });
                                           var oView = this.getView()
                                           oView.byId("_IDLoginGenInput").setValue("");
                                            oView.byId("_IDLoginGenInput1").setValue("");
                            
                        }
                        else {
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteUser", { userId: ID });
                                            var oView = this.getView()
                                            oView.byId("_IDLoginGenInput").setValue("");
                                             oView.byId("_IDLoginGenInput1").setValue("");
                        }
                    } else {
                        MessageToast.show("Invalid username or password.")
                    }
                }.bind(this),
                error: function () {
                    MessageToast.show("An error occured during login.");
                }
            })
        }

                })
    })



