'use strict';

define(['jquery', 'cordova', 'app', 'localizer', 'DALMain', 'commonScriptManager'],
       function ($, cordova, app, localizer, DALMain, commonScriptManager) {

	var DALProjects = {};

    DALProjects.dropTable = function(){
        var db = DALMain.db;
        var dropTable = "DROP TABLE IF EXISTS Projects";
        db.transaction(function(tx) {
            tx.executeSql(dropTable, [], function(){}, function(tr, err){alert(err.message);});
        });
    };

    DALProjects.createTable = function(callback){
        var db = DALMain.db;

        var tblDef = "CREATE TABLE IF NOT EXISTS Projects( "
         				+ "ProjectID INTEGER, "
         				+ "ProjectNo TEXT, "
         				+ "ReferenceNo TEXT, "
        				+ "ProjectName TEXT, "
						+ "AddressLine1 TEXT, "
        				+ "AddressLine2 TEXT, "
        				+ "City TEXT, "
                		+ "PostalCode TEXT, "
                		+ "State TEXT, "
                		+ "Country TEXT, "
        				+ "Status TEXT, "
                        + "PercentComplete INTEGER DEFAULT 0, "
                        + "Notes TEXT, "
        				+ "SurveyTypeID INTEGER, "
        				+ "AddedOn INTEGER, "
        				+ "UpdatedOn INTEGER,"
        				+ "RowGUID TEXT, "
                        + "ContractNo TEXT, "
                        + "NoOfUnits INTEGER, "
                        + "IsActive INTEGER DEFAULT 1, "
                        + "IsDeleted INTEGER DEFAULT 0, "
                        + "PRIMARY KEY(ProjectID, SurveyTypeID) "
                        +" );";

        db.transaction(function(tx) {
             tx.executeSql(tblDef, [], function(){
             	if (callback != null){
                    callback();
                }
             }, function(tx, err){alert(err.message);});
        });
    };

    DALProjects.clearData = function(){
        var db = DALMain.db;
        var dropTable = "DELETE FROM Projects";
         db.transaction(function(tx) {
            tx.executeSql(dropTable, []);
        });
    };

    DALProjects.addProject = function(ProjectID, projectNo, referenceNo, projectName, addressLine1, addressLine2, city, postalCode, state, country, status, percentComplete, notes, rowGUID, surveyType, contractNo, noOfUnits, successAddProjectCallBack) {
        var db = DALMain.db;
        var addedOn = commonScriptManager.parseDateMMDDYY(new Date());

        if(rowGUID == null || rowGUID == ''){
            rowGUID = app.getGUID();
        }

        if(percentComplete == null || percentComplete == ''){
            percentComplete = 0;
        }

        try{
             db.transaction(function(tx) {

                tx.executeSql("INSERT INTO Projects(ProjectID, ProjectNo, ReferenceNo, ProjectName, AddressLine1, addressLine2, City, PostalCode, State, Country, Status, PercentComplete, Notes, AddedOn, RowGUID, SurveyTypeID, ContractNo, NoOfUnits) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                              [ProjectID, projectNo, referenceNo, projectName, addressLine1, addressLine2, city, postalCode, state, country, status, percentComplete, notes, addedOn, rowGUID, surveyType, contractNo, noOfUnits],
                              successAddProjectCallBack,
                              DALProjects.onError);
            },
            function(tx, err){
                alert('err.message');
            });
        }
        catch(err){
            alert(err.message);
        }


    }

    DALProjects.onSuccess = function(tx, results){

    };

    /*DALProjects.onProjectAddSuccess = function(){
        app.mobileApp.hideLoading();
        alert(localizer.translateText("DALProjects.dataSaved"));
        app.mobileApp.navigate("app/homeView/view.html");
    };*/

    DALProjects.onError = function(tr, err){
        alert(err.message);
    };

    DALProjects.updateStatus = function(projectID, newStatusID, percentComplete){
        var db = DALMain.db;
        var updatedOn = new Date();
        db.transaction(function(tx) {
            tx.executeSql("UPDATE Projects SET  newStatusID = ?, percentComplete = ?, updatedOn = ? WHERE ProjectID = ?",
                          [newStatusID, percentComplete, updatedOn, projectID],
                          DALProjects.onSuccess,
                          DALProjects.onError);
        });
    };

    DALProjects.updateCompletion = function(projectID, percentComplete){
        var db = DALMain.db;
       	var updatedOn = new Date();
        db.transaction(function(tx) {
            tx.executeSql("UPDATE Projects SET  percentComplete = round(?, 2), updatedOn = ? WHERE ProjectID = ?",
                          [percentComplete, updatedOn, projectID],
                          DALProjects.onSuccess,
                          DALProjects.onError);
        });
    };

    DALProjects.updateProjectData = function(projectName, surveyType, address1, address2, city, postalcode, state, country, notes, projectID,updatesuccesscallback){
        var db = DALMain.db;
        var updatedOn = new Date();
        db.transaction(function(tx) {
            tx.executeSql("UPDATE Projects SET  projectName = ?, SurveyTypeID = ?, AddressLine1 = ?, AddressLine2 = ?, City = ?, PostalCode = ?, State = ?, Country = ?, Notes = ?, updatedOn = ? WHERE ProjectID = ?",
                          [ projectName, surveyType, address1, address2, city, postalcode, state, country, notes, updatedOn, projectID],
                          updatesuccesscallback,
                          DALProjects.onError );
        });
    };

    DALProjects.getAllProjects = function(resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM Projects WHERE isDeleted = 0', [], resultsCallback,  DALProjects.onError)
            });

        }
        catch(err){
            alert(err.message);
        }
    };

    DALProjects.getProject = function(projectID, resultsCallback){
        var db = DALMain.db;
        db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM Projects WHERE ProjectID = ? ', [projectID], resultsCallback,  DALProjects.onError)
        });
    };

    DALProjects.calculateCompletionStatus = function(projectID)
    {
        var db = DALMain.db;
        db.transaction(function(tx){
            tx.executeSql("SELECT (SELECT round(SUM(IFNULL(PercentComplete,0)), 2) FROM Buildings WHERE ProjectID = ? AND IsDeleted = 0) / (SELECT Count(*) FROM Buildings WHERE ProjectID = ? AND IsDeleted = 0) as Percentage",
                          [projectID, projectID],
                          function(tx, result)
                            {
                                if(result.rows.length > 0)
                                    {
                                        DALProjects.updateCompletion(projectID, result.rows.item(0).Percentage);
                                    }
                            },
                          DALProjects.onError);
        });
    };

    DALProjects.getMaxProject = function(resultsCallback){
        var db = DALMain.db;
        try{
             db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM Projects WHERE isDeleted = 0 and ProjectID = (select max(ProjectID) from Projects WHERE isDeleted = 0)', [], resultsCallback,  DALProjects.onError)
            });
        }
        catch(err){
            alert(err.message);
        }
    };

    DALProjects.saveNotes = function(projectID, notes, resultsCallback)
    {
        var db = DALMain.db;
        var updateQuery = "UPDATE Projects SET Notes = ? WHERE ProjectID = ? AND Status > 0";
        db.transaction(function(tx){
            tx.executeSql(updateQuery, [notes, projectID], resultsCallback, DALProjects.onError);
        });
    };

    DALProjects.projectExists = function(ids, resultsCallback) {
        var idClause = ' ProjectID in ('+ ids.join() + ');';
        var sqlst = 'SELECT * FROM Projects WHERE ' + idClause;
        var db = DALMain.db;
        db.transaction(function(tx) {
            tx.executeSql(sqlst , [], resultsCallback, DALProjects.onError);

        });
    }

    DALProjects.deleteProjectData = function(projectIDs, resultsCallback) {
        var db = DALMain.db;

        var deleteQuery = 'DELETE FROM InstallationGroups WHERE OpportunityID in (' + projectIDs.join() + ')';
        db.transaction(function (tx) {
            tx.executeSql(deleteQuery, [], function (tx) {
                //alert('Buildings deleted');
                var deleteQuery = 'DELETE FROM Projects WHERE ProjectID in (' + projectIDs.join() + ')';
                db.transaction(function (tx) {
                    tx.executeSql(deleteQuery, [], resultsCallback, DALProjects.onError);

                });
                //alert('Projects deleted');
            }, DALProjects.onError);
        });


        /* var deleteQuery = 'DELETE FROM ProjectARGApplicabilities WHERE ProjectID in ('+ projectIDs.join() + ')';
        db.transaction(function(tx){
            tx.executeSql(deleteQuery, [], function(tx){
                //alert('ProjectARGApplicabilities deleted');
                var deleteQuery = 'DELETE FROM Specs WHERE ProjectID in ('+ projectIDs.join() + ')';
                db.transaction(function(tx){
                    tx.executeSql(deleteQuery, [], function(tx){
                        //alert('Specs deleted');
                        var deleteQuery = 'DELETE FROM Sets WHERE ProjectID in ('+ projectIDs.join()+')';
                        db.transaction(function(tx){
                            tx.executeSql(deleteQuery, [], function(tx){
                                //alert('Sets deleted');
                                var deleteQuery = 'DELETE FROM Groups WHERE ProjectID in ('+ projectIDs.join()+')';
                                db.transaction(function(tx){
                                    tx.executeSql(deleteQuery, [], function(tx){
                                        //alert('Groups deleted');
                                        var deleteQuery = 'DELETE FROM Buildings WHERE ProjectID in ('+ projectIDs.join()+')';
                                        db.transaction(function(tx){
                                            tx.executeSql(deleteQuery, [], function(tx){
                                                //alert('Buildings deleted');
                                                var deleteQuery = 'DELETE FROM Projects WHERE ProjectID in ('+ projectIDs.join()+')';
                                                db.transaction(function(tx){
                                                    tx.executeSql(deleteQuery, [], resultsCallback, DALProjects.onError);

                                                });
                                                //alert('Projects deleted');
                                            }, DALProjects.onError);
                                        });
                                    }, DALProjects.onError);
                                });
                            }, DALProjects.onError);
                        });
                    }, DALProjects.onError);
                });
            }, DALProjects.onError);
            });*/

    }
    return DALProjects;
});
