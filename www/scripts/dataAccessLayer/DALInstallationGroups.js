'use strict';

define(['jquery', 'cordova', 'app', 'localizer', 'DALMain', 'DALProjects'],
       function ($, cordova, app, localizer, DALMain, DALProjects) {

	var DALInstallationGroups = {};

    DALInstallationGroups.dropTable = function(){
        var db = DALMain.db;
        var dropTable = "DROP TABLE IF EXISTS InstallationGroups";
        db.transaction(function(tx) {
            tx.executeSql(dropTable, [], null, DALInstallationGroups.onError);
        });
    };

    DALInstallationGroups.createTable = function(callback){
        var db = DALMain.db;

        var tblDef = "CREATE TABLE IF NOT EXISTS InstallationGroups("
         				+ "OpportunityID INTEGER, "
         				+ "OpportunityInstallationGroupID INTEGER, "
         				+ "OpportunityInstallationGroupName TEXT, "
                        + "OpportunityInstallationGroupNo TEXT, "
                        + "OpportunityInstallationGroupDescription TEXT, "
                        + "OpportunityInstallationGroupAbbreviation TEXT, "
                        + "PercentComplete INTEGER DEFAULT 0, "
                        + "UnitNames TEXT, "
        				+ "RowGUID TEXT,"
                        + "AddedOn TEXTDATETIME, "
        				+ "UpdatedOn TEXTDATETIME,"
                        + "IsActive INTEGER DEFAULT 1, "
                        + "IsDeleted INTEGER DEFAULT 0, "
        				+ "PRIMARY KEY(OpportunityID, OpportunityInstallationGroupID)"
        				+ ");";

        db.transaction(function(tx) {
             tx.executeSql(tblDef, [], function(){
                 if(callback != null)
                     callback();
             }, DALInstallationGroups.onError);
        });
    };

    DALInstallationGroups.clearData = function(){
        var db = DALMain.db;
        var dropTable = "DELETE FROM InstallationGroups";
         db.transaction(function(tx) {
            tx.executeSql(dropTable, []);
        });
    };

    DALInstallationGroups.addInstallationGroup = function(opportunityID, opportunityInstallationGroupID, opportunityInstallationGroupNo, opportunityInstallationGroupName,
                                                	opportunityInstallationGroupDescription, opportunityInstallationGroupAbbreviation, percentComplete, unitNames, rowGUID, updatesuccesscallback) {
        var db = DALMain.db;
        var addedOn = new Date();
        if(rowGUID == null || rowGUID == ''){
            rowGUID = app.getGUID();
        }

        if(percentComplete == null || percentComplete == ''){
            percentComplete = 0;
        }
        try{
             db.transaction(function(tx) {
                tx.executeSql("INSERT INTO InstallationGroups(OpportunityID, OpportunityInstallationGroupID, OpportunityInstallationGroupNo, OpportunityInstallationGroupName, OpportunityInstallationGroupDescription, OpportunityInstallationGroupAbbreviation, PercentComplete, UnitNames, AddedOn, RowGUID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                              [opportunityID, opportunityInstallationGroupID, opportunityInstallationGroupNo, opportunityInstallationGroupName,
                                                	opportunityInstallationGroupDescription, opportunityInstallationGroupAbbreviation,
                                                        percentComplete, unitNames, addedOn, rowGUID],
                              updatesuccesscallback,
                              DALInstallationGroups.onError);
            },
            function(tx, err){
                alert('err.message');
            });
        }
        catch(err){
            alert(err.message);
        }


    }

    DALInstallationGroups.getAllInstallationGroups = function(resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM InstallationGroups WHERE isDeleted = 0', [], resultsCallback,  DALInstallationGroups.onError)
            });
        }
        catch(err){
            alert(err.message);
        }
    };

    DALInstallationGroups.getInstallationGroup = function(OpportunityID, OpportunityInstallationGroupID, resultsCallback){
        var db = DALMain.db;
        db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM InstallationGroups WHERE OpportunityID = ? AND OpportunityInstallationGroupID = ? AND isDeleted = 0', [OpportunityID, OpportunityInstallationGroupID], resultsCallback,  DALInstallationGroups.onError)
        });
    };

    DALInstallationGroups.getInstallationGroupsOfAProject = function(OpportunityID, resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM InstallationGroups WHERE OpportunityID = ? AND isDeleted = 0', [OpportunityID], resultsCallback,  DALInstallationGroups.onError)
            });
        }
        catch(err){
            alert(err.message);
        }
    };

    DALInstallationGroups.updateInstallationGroupsData = function(OpportunityInstallationGroupName, notes, OpportunityInstallationGroupID, OpportunityID, updatesuccesscallback){
        var db = DALMain.db;
        var updatedOn = new Date();
        db.transaction(function(tx) {
            tx.executeSql("UPDATE InstallationGroups SET  OpportunityInstallationGroupName = ?, Notes = ?, updatedOn = ? WHERE OpportunityInstallationGroupID = ? and OpportunityID =?",
                          [OpportunityInstallationGroupName, notes, updatedOn, OpportunityInstallationGroupID, OpportunityID],
                          updatesuccesscallback,
                          DALProjects.onError);
        });
    };

    DALInstallationGroups.updateStatus = function(OpportunityID, OpportunityInstallationGroupID, newStatusID, percentComplete){
        var db = DALMain.db;
        var updatedOn = new Date();
        db.transaction(function(tx) {
            tx.executeSql("UPDATE InstallationGroups SET  newStatusID = ?, percentComplete = round(?, 2), updatedOn = ? WHERE OpportunityID = ? AND OpportunityInstallationGroupID = ?",
                          [newStatusID, percentComplete, updatedOn, OpportunityID, OpportunityInstallationGroupID],
                          DALInstallationGroups.onSuccess,
                          DALInstallationGroups.onError);
        });
    };

    DALInstallationGroups.updateCompletion = function(OpportunityID, OpportunityInstallationGroupID, percentComplete){
        var db = DALMain.db;
       	var updatedOn = new Date();
        db.transaction(function(tx) {
            tx.executeSql("UPDATE InstallationGroups SET  percentComplete = round(?, 2), updatedOn = ? WHERE OpportunityID = ? AND OpportunityInstallationGroupID = ?",
                          [percentComplete, updatedOn, OpportunityID, OpportunityInstallationGroupID],
                          function(tx){ DALProjects.calculateCompletionStatus(OpportunityID); },
                          DALInstallationGroups.onError);
        });
    };


   	/*DALInstallationGroups.updateNoOfSetsAndUnits = function(OpportunityID, buildingID){
        var noOfSets = 0;
        var noOfUnits = 0;
        require(['DALGroups'], function (DALGroups) {
            DALGroups.getGroupsOfABuilding(OpportunityID, buildingID, function(tx, groups){
                for(var i=0; i < groups.rows.length; i++){
                    noOfSets = noOfSets + groups.rows.item(i).noOfSets
                    noOfUnits = noOfUnits + groups.rows.item(i).NoOfUnits;
                }
                var db = DALMain.db;
                var updatedOn = new Date();
                db.transaction(function(tx){
                    tx.executeSql("UPDATE InstallationGroups SET NoOfSets = ?, NoOfUnits =?, UpdatedOn = ? WHERE  OpportunityID = ? AND buildingID = ? ",
                              [noOfSets, noOfUnits, updatedOn, OpportunityID, buildingID],
                              DALGroups.onSuccess,
                              DALGroups.onError);
                });
            });
    	});
    };*/

    DALInstallationGroups.calculateCompletionStatus = function(OpportunityID, OpportunityInstallationGroupID)
    {
        var db = DALMain.db;
        db.transaction(function(tx){
            tx.executeSql("SELECT (SELECT round(SUM(IFNULL(PercentComplete,0)), 2) FROM Groups WHERE OpportunityID = ? AND OpportunityInstallationGroupID = ? AND IsDeleted = 0) / "
                          			+"(SELECT COUNT(*) FROM Groups WHERE OpportunityID = ? AND OpportunityInstallationGroupID = ?  AND IsDeleted = 0) as Percentage FROM InstallationGroups WHERE  OpportunityID = ? AND OpportunityInstallationGroupID = ?  AND IsDeleted = 0 ",
                          [OpportunityID, OpportunityInstallationGroupID, OpportunityID, OpportunityInstallationGroupID, OpportunityID, OpportunityInstallationGroupID],
                          function(tx, result)
                            {
                                if(result.rows.length > 0)
                                    {
                                       DALInstallationGroups.updateCompletion(OpportunityID, OpportunityInstallationGroupID, result.rows.item(0).Percentage);
                                    }
                            },
                          DALInstallationGroups.onError);
        });
    };

    /*DALInstallationGroups.updateNoOfSetsAndNoOfUnits = function(OpportunityID, buildingID)
        {
			var db = DALMain.db;
            db.transaction(function(tx)
          	{
				tx.executeSql("UPDATE InstallationGroups "
                              	+ " SET NoOfSets = (SELECT SUM(NoOfSets) FROM Groups WHERE OpportunityID = ? AND BuildingID = ? AND Status > 0 ), "
                              	+ " NoOfUnits = (SELECT SUM(NoOfUnits) FROM Groups WHERE OpportunityID = ? AND BuildingID = ? AND Status > 0 ) "
                              	+ " WHERE OpportunityID = ? AND BuildingID = ? AND Status > 0 ",
                            [OpportunityID, buildingID, OpportunityID, buildingID, OpportunityID, buildingID],
                            DALInstallationGroups.onSuccess,
                          	DALInstallationGroups.onError
                         );
            });
        };*/

    DALInstallationGroups.saveNotes = function(OpportunityID, OpportunityInstallationGroupID, notes, resultsCallback)
    {
        var db = DALMain.db;
        var updateQuery = "UPDATE InstallationGroups SET Notes = ? WHERE OpportunityID = ? AND OpportunityInstallationGroupID = ? AND Status > 0";
        db.transaction(function(tx){
            tx.executeSql(updateQuery, [notes, OpportunityID, OpportunityInstallationGroupID], resultsCallback, DALInstallationGroups.onError);
        });
    };

    DALInstallationGroups.getMaxInstallationGroupNo = function(resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM InstallationGroups WHERE isDeleted = 0 and OpportunityInstallationGroupID = (select max(OpportunityInstallationGroupID) from InstallationGroups WHERE isDeleted = 0)', [], resultsCallback,  DALInstallationGroups.onError)
            });
        }
        catch(err){
            alert(err.message);
        }
    };

    DALInstallationGroups.onSuccess = function(tx, results){
    };

    DALInstallationGroups.onError = function(tr, err){
        alert(localizer.translateText("DALInstallationGroups.buiding") + "  " + err.message);
    };

    return DALInstallationGroups;
});
