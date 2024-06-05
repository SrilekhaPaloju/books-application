sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"

], function (Controller, Fragment) {
    'use strict';

    return Controller.extend("com.app.libraryapplication.controller.BaseController", {
        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },
        loadFragment: async function (sFragmentName) {
            const oFragment = await Fragment.load({
                id: this.getView().getId(),
                name: `com.app.libraryapplication.fragments.${sFragmentName}`,
                controller: this
            });
            this.getView().addDependent(oFragment);
            return oFragment
        },
        createData: async function (oModel, oData, sPath) {
            debugger;
            return new Promise((resolve, reject) => {
                oModel.create(sPath, oData, {
                    success: function (oSuccessData) {
                        resolve(oSuccessData);
                    },
                    error: function (oErrorData) {
                        reject(oErrorData)
                    }
                })
            })
        },
        createIssue: async function (oModel1, oData1, sPath1) {
            debugger;
            return new Promise((resolve, reject) => {
                oModel1.create(sPath1, oData1, {
                    success: function (oSuccessData) {
                        resolve(oSuccessData);
                    },
                    error: function (oErrorData) {
                        reject(oErrorData)
                    }
                })
            })
        },
        UpdateBook: async function (oModel2, oData2, sPath2) {
            debugger;
            return new Promise((resolve, reject) => {
                oModel2.update(sPath2, oData2, {
                    success: function (oSuccessData) {
                        resolve(oSuccessData);
                    },
                    error: function (oErrorData) {
                        reject(oErrorData)
                    }
                })
            })
        },

    })

});