sap.ui.define(
    [
        "./BaseController",
        "sap/m/MessageBox"
    ],
    function(BaseController, MessageBox) {
      "use strict";
  
      return BaseController.extend("com.app.booksdetails.controller.Details", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onBooksDetailsLoad, this); 
        },
        onBooksDetailsLoad: function(oEvent){
         const {bookID} = oEvent.getParameter("arguments");
         this.ID = bookID;
        const sRouterName = oEvent.getParameter("name");
         const oObjectPage = this.getView().byId("idBookDetailsObjectPage");

         oObjectPage.bindElement(`/Books(${bookID})`, {
            // expand: 'Address,Bokdetails'
    });

    },
    onDeleteBook: async function(){
        const oModel = this.getView().getModel("ModelV2");
       debugger;
        try {
          await this.deleteData(oModel, "/Books", this.ID);
          this.getRouter().navTo("RouteHome");
        } catch (error) {
          MessageBox.error("Some Technical Issue");
        }
    }
    });
}
      );