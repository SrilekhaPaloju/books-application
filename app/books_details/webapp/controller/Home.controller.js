sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Token, Fragment, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("com.app.booksdetails.controller.Home", {
            onInit: function () {
                const oLocalModel = new JSONModel({

                    AuthorName: "",
                    title: "",
                    Stock: "",
                    AuthorNumber: "",
                });
                this.getView().setModel(oLocalModel, "localModel");
                this.getRouter().attachRoutePatternMatched(this.onBookListLoad, this);
            },
            onBookListLoad: function () {
                this.getView().byId("idBooksTable").getBinding("items").refresh();


                var oView = this.getView();
                // set explored app's demo model on this sample
                var oMultiInput1 = oView.byId("multiInput1");
                oMultiInput1.addValidator(function (args) {

                    if (true) {
                        var text = args.text;

                        return new Token({ key: text, text: text });
                    }
                });
                var oMultiInput2 = oView.byId("multiInput2");
                oMultiInput2.addValidator(function (args) {
                    if (true) {
                        var text = args.text;

                        return new Token({ key: text, text: text });
                        
                    }
                });
                var oMultiInput3 = oView.byId("multiInput3");
                oMultiInput3.addValidator(function (args) {
                    if (true) {
                        var text = args.text;

                        return new Token({ key: text, text: text });
                    }
                });

            },

            onGoPress: function () {

                const oView = this.getView(),

                    oIdFilter = oView.byId("multiInput1"),
                    sId = oIdFilter.getTokens(),

                    oTitleFilter = oView.byId("multiInput2"),
                    sTitle = oTitleFilter.getTokens(),

                    oAuthorFilter = oView.byId("multiInput3"),
                    sAuthor = oAuthorFilter.getTokens(),

                    oTable = oView.byId("idBooksTable"),
                    aFilters = [];

                sId.filter((element) => {
                    element ? aFilters.push(new Filter("ID", FilterOperator.EQ, element.getKey())) : "";
                })
                sTitle.filter((element1) => {
                    element1 ? aFilters.push(new Filter("title", FilterOperator.EQ, element1.getKey())) : "";
                })
                sAuthor.filter((element2) => {
                    element2 ? aFilters.push(new Filter("AuthorName", FilterOperator.EQ, element2.getKey())) : "";
                })
                oTable.getBinding("items").filter(aFilters);
            },

            onClearFilterPress: function () {
                const oView = this.getView(),
                    ID = oView.byId("multiInput1").removeAllTokens(),
                    title = oView.byId("multiInput2").removeAllTokens(),
                    Author = oView.byId("multiInput3").removeAllTokens()
            },
            onSelectBook: function (oEvent) {
                debugger;
                const { ID, AuthorName } = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
                const oRouter = this.getRouter();
                oRouter.navTo("RouteDetails", {
                    bookID: ID,
                    Name: AuthorName

                })
            },
            onCreateButton: async function () {
                debugger;
                if (!this.oCreateBookDialog) {
             this.oCreateBookDialog = await this.loadFragment("CreateBookDialog")
                debugger;
                }

                this.oCreateBookDialog.open();
            },
            onCloseDialog: function () {
                if (this.oCreateBookDialog.isOpen()) {
                    this.oCreateBookDialog.close()
                }
            },
            onCreateBook: async function () {
                const oPayload = this.getView().getModel("localModel").getProperty("/"),
                    oModel = this.getView().getModel("ModelV2");
                debugger;
                try {
                    await this.createData(oModel, oPayload, "/Books");
                    this.getView().byId("idBooksTable").getBinding("items").refresh();
                    this.oCreateBookDialog.close();

                }
                catch (error) {
                    this.oCreateBookDialog.close();
                    MessageBox.error("Some technical Issue");
                }
            }
        });
    });
