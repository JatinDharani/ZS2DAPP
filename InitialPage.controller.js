sap.ui.define([
	"LPI/ZS2D_LPI_PICK_SHIP/ZS2D_LPI_PICK_SHIP/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("LPI.ZS2D_LPI_PICK_SHIP.ZS2D_LPI_PICK_SHIP.controller.InitialPage", {

	
		onInit: function () {
			this._checkUserDefaults();	
		 	this.getOwnerComponent().getModel().metadataLoaded().then(function(){
		this._checkUserDefaults();		
			}.bind(this));
           
		},
		onConfirmDetails:function(){
		 var bValidated = this._validateFormInput();
		 if(bValidated){
		 var oModel = this.getOwnerComponent().getModel();
		 	var oData = {"ShipPoint":this.getView().getModel("clientModel").getProperty("/ShipPoint"),
		 		"DeliveryDate":this.getView().getModel("clientModel").getProperty("/DeliveryDate"),
		 		"DefaultPrinter":this.getView().getModel("clientModel").getProperty("/DefaultPrinter")
		 	};
		 		var oCreateDefaultsPromise = this._prepareODataPromise("create","/UserDefaultSet",oData,null,oModel);
		 }
		},
		_validateFormInput:function(){
			var aMandatoryFields = ["/ShipPoint","/DeliveryDate","/DefaultPrinter"];
			var oModel = this.getView().getModel("clientModel");
			var bValidated = true;
			aMandatoryFields.forEach(function(sField){
				oModel.setProperty(sField+"Valuestate","None");
				if(!oModel.getProperty(sField)) {bValidated = false; oModel.setProperty(sField+"Valuestate","Error")};
			}.bind(this));
		},
		 _checkUserDefaults:function(){
        	var oModel = this.getOwnerComponent().getModel();
        	var oCheckUserDefaultsPromise = this._prepareODataPromise("read","/UserDefaultSet(UserId='')",null,null,oModel);
        	oCheckUserDefaultsPromise.then(function(response){
        	var bUserDefaultMaintained = this._validateUserDefault(response.data);
        	this._showMaitainDefaultDialog(bUserDefaultMaintained);
        	
        	}.bind(this));
        },
        _showMaitainDefaultDialog:function(bUserDefaultMaintained){
        	if(bUserDefaultMaintained) return;
        		if (!this.userDialog) {
				this.pDialog = this.loadFragment({
					name: "LPI.ZS2D_LPI_PICK_SHIP.ZS2D_LPI_PICK_SHIP.view.fragments.userDefaultForm"
				});
			}

			this.userDialog.then(function(oDialog) {
				oDialog.open();
			});
        },
        _validateUserDefault:function(aResult){
        	var aPropertyToCheck = ["UserId","ShipPoint","DeliveryDate","DefaultPrinter"];
           if(!aResult ){
           	return false;
           }
           else{
           	var bReturn  = true;
           	aPropertyToCheck.forEach(function(oProperty){
           		if(!aResult[oProperty]){
           			bReturn = false;
           		}
           	}.bind(this));
           	return bReturn;
           }
        }
        
	

	});

});