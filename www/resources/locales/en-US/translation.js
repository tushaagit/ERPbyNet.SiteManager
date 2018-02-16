'use strict';
define([],
       function () {
    	var en_US = {
            "app.name": "SmartSiteSurvey",
            "login.userName" : "User name",
            "login.password": "Password",
            "login.signIn": "Login",
            "login.tryToAuthMsg": "Trying to authenticate...",
            "login.invalidDataMsg": "Oops! There is invalid data in the form.",
            "login.loginSuccessMsg": "Login successful.",
            "login.loginFailMsg": "Login failed.",
            "login.authentication": "Authentication",
            
            "app.back": "Back",
            "app.homeMenu": "Home",
            "app.setupMenu": "Setup",
            "app.downloadProjectsMenu": "Download projects",
            "app.aboutApp": "About SmartSiteSurvey",
            "app.checkUpdates": "Check updates",
            "app.failed": "Failed",
            "app.signout": "Logout",
            "app.emailErrorLog": "Email Error Log",
            "app.footerCopyright": "Powered by: XECOM Information Technologies Pvt. Ltd.",
            "app.exit":"Exit",
            
            "aboutView.copyrightMsg": "Copyright © 2016-17 XECOM Information Technologies Pvt. Ltd.",

            "homeView.dashboard": "Dashboard",
            "homeView.ProjectsList": "Projects",
            "homeView.deviceStatus": "Device status",
            "homeView.connection": "Connection",
            "homeView.confirmUploadMsg": "Click OK to continue to upload data to Server",
            "homeView.uploadCancelMsg": "Upload process cancelled!",
            "homeView.upldTotlRecCntMsg": "Total records : {0}. upload started..",
            "homeView.home": "Home",
            "homeView.deviceStatMsg": "% Space Occupied",
            "homeView.noProjectsMessage": "Please download projects for the surveys to be performed.",
            "homeView.UploadingMediaFiles": "Uploading media files.",
            "homeView.addNewProject": "Add New Project",
            "homeView.UploadingAborted": "All mandatory questions must be answered before uploading project data. \n Please refer to the list of unanswered questions below. ",
            "homeView.PhotosRequiredAlert": "All questions that needs photos must be added with photos before uploading project data. Please refer to the list of questions that are missing photos below. ",
            "homeView.UploadAbortText" : "All mandatory questions must be answered before uploading project data.",
            "homeView.unansweredQuestionsList" : "List of questions which are not answered.",
            "homeView.allQuestionAnswered" : "All mandatory questions answered",
            "homeView.noconnection" : "No internet connection. Please try after some time.",
            
            "projectView.projectCap": "Project",
            "projectView.notes": "Notes",
            "projectView.save": "Save",
            "projectView.close": "Close",
            "projectView.addressCap": "Address:",
            "projectView.completeCap": "% Complete:",
            "projectView.buildingCol": "Building",
            "projectView.noOfSetsCol": "# Sets",
            "projectView.noOfUnitsCol": "# Units",
            "projectView.perCompCol": "% Complete",            
            "projectView.noOfSymbol": "#",
            "projectView.percentageSymbol": "%",
            "projectView.colonSymbol": ":",
            "projectView.addNewBuilding" : "Add New Building",
            
            "addEditProjectView.ProjectName": "Project Name",
            "addEditProjectView.address":"Address",
            "addEditProjectView.city": "City",
            "addEditProjectView.postalCode": "Postal code",
            "addEditProjectView.country": "Country",
            "addEditProjectView.state": "State",
            "addEditProjectView.percComp": "Percetage",
            "addEditProjectView.notes": "Notes",
            "addEditProjectView.save": "Save",
            "addEditProjectView.uploadData": "Upload",
            "addEditProjectView.emptyProjNameMsg": "Please enter project name",
            "addEditProjectView.emptyAdd1Msg": "Please enter address line 1",
            "addEditProjectView.emptyAdd2Msg": "Please enter address line 2",
            "addEditProjectView.emptyCityMsg": "Please enter city",
            "addEditProjectView.emptyPostalCodeMsg": "Please enter postal code",
            "addEditProjectView.perCompErrorMsg": "Please enter percetage complete",
            "addEditProjectView.emptyPostalCodeMsg": "Please enter postal code",
            "addEditProjectView.perCompErrorMsg": "Please enter percetage complete",
            "addEditProjectView.ProjectNo": "ProjectNo:",
            "addEditProjectView.emptyProjNoMsg": "Please enter projectNo", 
            "addEditProjectView.invalidDataMsg": "Please enter values for all fields",  
            "addEditProjectView.dataSaved": "Data Saved Successfully!",

            "addEditBuildingView.ProjectName": "Project Name:",
            "addEditBuildingView.BuildingNo":"Building No:",
            "addEditBuildingView.buildingName":"Building:",
            "addEditBuildingView.noOfSets": "No of sets:",
            "addEditBuildingView.noOfUnits": "No of units:",
            "addEditBuildingView.percComp": "% Complete:",      
            "addEditBuildingView.notes" : "Notes:",      
            "addEditBuildingView.save": "Save",
            "addEditBuildingView.uploadData": "Upload",
            "addEditBuildingView.emptyBuildingNoMsg": "Please enter Building No",
            "addEditBuildingView.emptyBldNameMsg": "Please enter Building name",
            "addEditBuildingView.emptyBldgNoOfSets": "Please enter No of Sets",
            "addEditBuildingView.emptyBldgNoOfUnits": "Please enter No of Units",
            "addEditBuildingView.emptyBldPercComp": "Percentage should be between 0 to 100",           
            "addEditBuildingView.invalidDataMsg": "Please enter values for all fields", 
            "addEditBuildingView.dataSaved": "Data Saved Successfully!",

            "addEditGroupView.ProjectName": "Project Name:",
            "addEditGroupView.BuildingName": "Building Name:",
            "addEditGroupView.GroupNo":"Group No:",
            "addEditGroupView.groupName":"Group:",
            "addEditGroupView.noOfSets": "No of sets:",
            "addEditGroupView.noOfUnits": "No of units:",
            "addEditGroupView.percComp": "% Complete:",            
            "addEditGroupView.notes" : "Notes:",
            "addEditGroupView.save": "Save",
            "addEditGroupView.uploadData": "Upload",
            "addEditGroupView.emptyGroupNoMsg": "Please enter Group No",
            "addEditGroupView.emptyGroupNameMsg": "Please enter Group Name",
            "addEditGroupView.emptyGroupNoOfSets": "Please enter No of Sets",
            "addEditGroupView.emptyGroupNoOfUnits": "Please enter No of Units",
            "addEditGroupView.emptyGroupPercComp": "Percentage should be between 0 to 100",           
            "addEditGroupView.invalidDataMsg": "Please enter values for all fields", 
            "addEditGroupView.dataSaved": "Data Saved Successfully!",

            "DALProjects.dataSaved": "Data Saved Successfully!",
            "DALGroups.dataSaved": "Data Saved Successfully!",
            "DALBuildings.buiding": "buiding",
            "DALConfigParams.configParamFailed": "Failed to get config parameters",
            "DALConfigParams.configError": "DALConfig error: ",
            "DALDataSyncStatus.failedServerTime": "failed to get server updated time",
            "DALDataSyncStatus.statusError": "DALDataSyncStatus error: ",
            "DALDataSyncStatus.settingFailed": "setting updated on failed ",
            "DALErrorLog.error": "DALErrorLog error: ",
            "DALHelper.mediaUploadProgress": "Uploading media files is in progress in the background. You can continue.",
            "DALHelper.uploadedImages": "uploaded images",
            "DALMain.databaseError": "db err : ",
            "DALNewProductTypes.error": "DALNewProductTypes error: ",
            "DALOldProductTypes.error": "DALOldProductTypes error: ",
            "DALTrialVersion.error": "DALTrialVersion error: ",

            "buildingView.ProjectName": "Project:",
            "buildingView.Notes": "Notes",
            "buildingView.Save": "Save",
            "buildingView.Close": "Close",
            "buildingView.buildingName": "Building",
            "buildingView.noOfSets": "No. of sets",
            "buildingView.noOfUnits": "No. of units",
            "buildingView.percComp": "% Complete",
            "buildingView.groupNoCol": "Group#",
            "buildingView.groupNameCol": "Group",
            "buildingView.noOfSetsCol": "# Sets",
            "buildingView.perCompCol": "%Complete",
            "buildingView.noOfUnitsCol": "# Units",
            "buildingView.addNewGroup": "Add New Group",  
                                   
            "groupView.ProjectgName": "Project",
            "groupView.notes": "Notes",
            "groupView.save": "Save",
            "groupView.close": "Close",
            "groupView.buildingName": "Building",
            "groupView.groupName": "Group",
            "groupView.noOfUnits": "# Units",
            "groupView.percComp": "% Complete",
            "groupView.setNameCol": "# Sets",
            "groupView.oldProductNameCol": "Old product",
            "groupView.noOfUnitsCol": "# Units",
            "groupView.percCompCol": "% Complete",
            "groupView.addNewSet": "Add New Set",
            
            "setView.ProjectName": "Project",
            "setView.buildingName": "Building",
            "setView.groupName": "Group",
            "setView.SetNo": "Set No",
            "setView.setName": "Set",
            "setView.oldProductType": "Old product type",
            "setView.newProductType": "New product type",
            "setView.noOfUnits": "No of units",
            "setView.percComp": "Percentage complete",
            "setView.notes": "Notes",
            "setView.save": "Save",
            "setView.uploadData":"Upload",
            "setView.emptySetNoMsg":"Enter Set No",
            "setView.emptySetNameMsg": "Enter set name_",
            "setView.noOfUnitsErrorMsg": "No. of units should not be less than 1_",
            "setView.perCompErrorMsg": "Percentage should be between 0 to 100_",
            "setView.totalSpecMsg": "Total Specs : {0} upload started..",
            "setView.setUpdatedMsg": "Set details updated successfully.",

            "setCopyView.copyStartMsg": "Copy Started",
            "setCopyView.copySuccessMsg": "Copy successful",
            "setCopyView.noSpecsFound": "No Specs Found",
            "setCopyView.copyConfirmMsg": "Do you really want to copy this set?",

            "dbInitView.close": "Close",
            "dbInitView.eraseDataConfirmMsg" : "All configuration data will be erased. Do you want to continue?",
            "dbInitView.eraseYesNoMsg" : "Do you want to erase data?",
            "dbInitView.nextBtn" : "Next",
            
            "downloadProductsView.close": "Close",
            "downloadProductsView.syncStartMsg": "Survey definition data sync in progress. Please wait...",
            "downloadProductsView.synchSrvyDefs": "Synchronize Survey Definitions",
            "downloadProductsView.syncCompMsg": "Survey definition data sync completed, please close and proceed.",
            "downloadProductsView.imageDownloadBackground": "Images will be download at background, you may close and proceed.",
                        
            "downloadProjectsView.searchTextName": "Search text",
            "downloadProjectsView.search": "Search",
            "downloadProjectsView.listOfOpportunities": "List of opportunities",
            "downloadProjectsView.emptySearchTextMsg": "Enter search text for the project name",
            "downloadProjectsView.servCallFailMsg": "Service call failed: {0}",
            "downloadProjectsView.dwnldCallFailMsg": "Download call failed: {0}",
            "downloadProjectsView.bindDataMsg": "bind data {0}",
            "downloadProjectsView.dwnldCompleteMsg": "Download complete",
            "downloadProjectsView.insertDataMsg": "insert Data {0}",
            "downloadProjectsView.dwnldErrMsg": "Download error:",
            "downloadProjectsView.dwnldProjects": "Download Projects",
            "downloadProjectsView.dwnldSeccMsg": "Download succeeded err: {0}",
            "downloadProjectsView.download" : "Download",
            "downloadProjectsView.downloadConfirmationMsg" : "Some of the selected projects already exist. Do you want to overwrite those?",
            "downloadProductsView.invalidDataMsg": "Please enter values for all fields",
            "downloadProductsView.dataSaveSuccess" :"Configuration saved successfully!",

            "configView.tokenlife": "Token Life",
            "configView.errorTokenLife" : "Enter Token Life",
            "configView.servicePath": "Service Path",
            "configView.servicePathError" : "Enter Service Path",
            "configView.mediaServicePath": "Media Service Path",
            "configView.mediaServicePathError" : "Enter Media Service Path",
            "configView.KnowledgebaseID": "Knowledge Base ID",
            "configView.knowledgebaseIDError" : "Enter Knowledge Base ID",
            "configView.Company": "Company",         
            "configView.CompanyError": "Enter Company Name",     
            "configView.Submit" : "Save", 
            "configView.saveConfigParam" : "Save Config Parameters",

            "imageGallery.fileName": "File Name",
            "mediaGalleryView.emptyFileNameMsg": "Enter file name_",
            "mediaGalleryView.fileDeletedMsg": "File {0} is deleted",
            "mediaGalleryView.fileSavedMsg": "File saved successfully",
            "mediaGalleryView.errorCodeMsg": "Error code: {0}",
            "mediaGalleryView.imgGallery": "Image Gallery",
            "mediaGalleryView.vidGallery": "Video Gallery",
            "mediaGalleryView.sortBy" : "Sort by",
            "mediaGalleryView.overWriteConfirm": "This name is already taken, are you sure you want to overwrite the photo?",
            "mediaGalleryView.deleteConfirm": "The Selected Image will be deleted. Press OK To Confirm",
            "mediaGalleryView.sketchFail": "Sketch fail",
            "mediaGalleryView.errorFileSystem": "### ERR: filesystem.directoryUp() -",
            "mediaGalleryView.note":"Note:",
            "mediaGalleryView.noteMsg": "Please catpure photos/videos with low resolution. High resolution images are large in size and may cause issues in upload.",

            "setView.failed": "failed",

            "networkInfoView.checkConnection": "Check Connection",
            "networkInfoView.goToHome": "Go Home",
            "networkInfoView.connectionTypeCap": "Connection type:",
            "networkInfoView.lastCheckAtCap": "Last check at:",
            "networkInfoView.networkInfo": "Network Information",
            
            "setup.lblSetupDB": "Setup database",
            "setup.DBSetup": "Proceed",
            "setup.dropTables": "Drop tables first",
            "setup.close": "Close",
            "setup.setup": "Setup",
            "setup.dbInitMsg": "Initializing database setup, please wait...",
            "setup.dbSetupCompMsg": "Database setup completed",
            "setup.smplDataPopltngMsg": "Polulating sample data...",
            "setup.dataPoplStrtMsg": "Data population started",
            "setup.projAddMsg": "{0} projects added.",
            "setup.bldgAddMsg": "{0} buildings added.",
            "setup.grpAddMsg": "{0} groups added.",
            "setup.setAddMsg": "{0} sets added",
            "setup.dataPoplCompMsg": "Data population completed",
            "setup.dbInitCompMsg": "Database initilization completed",
            

            "setupView.tblDropMsg": "Tables will be dropped and recreated.",
            
            "surveyView.back": "Back",
            "surveyView.projectName": "Project",
            "surveyView.surveyVersionNo": "Survey Version",
            "surveyView.categoryGroup": "Location :: Equipment Type",
            "surveyView.helpText": "Help about the survey question.",
            "surveyView.notes": "Notes",
            "surveyView.save": "Save",
            "surveyView.close": "Close",
            "surveyView.survey": "Survey",
            "surveyView.noHelp": "No help available.",
            "surveyView.note": "Note",
            "surveyView.building": "Buildings",
            "surveyView.group": "Groups",
            "surveyView.set": "Sets",

            "trialExpired.message": "Your trial has expired. Please contact us at sales@xecomit.com to extend the trail.",
            "trialExpired.trialExp": "Trial expired"
       }
       return en_US;
});