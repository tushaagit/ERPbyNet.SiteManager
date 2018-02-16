define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'buildingManager','DALProjects', 'DALBuildings', 'DALGroups', 'DALSets'],
       function ($, cordova, kendo, app, localizer, WSHandler, buildingManager,DALProjects, DALBuildings, DALGroups, DALSets) {
   
    var projectManager = {};
    
    projectManager.addProject = function(projectsInfo, surveyTypeID, successAddProjectCallBack){
         DALProjects.addProject(projectsInfo.ProjectID, projectsInfo.ProjectNo, projectsInfo.ReferenceNo,
        projectsInfo.ProjectName,projectsInfo.AddressLine1,projectsInfo.AddressLine2,projectsInfo.City
        ,projectsInfo.PostalCode,projectsInfo.State,projectsInfo.Country,projectsInfo.Status
        ,projectsInfo.PercentComplete,projectsInfo.Notes, projectsInfo.RowGuid, surveyTypeID, successAddProjectCallBack);
        
    };
    
    projectManager.insertAllProjectData = function(projectsInfo, surveyTypeIds, successAddProjectCallBack){
		var SITE_SURVEY_TYPE;
         $.each( projectsInfo, function( key, value ) {
          //check if project exists, if not insert project data
           if(surveyTypeIds[projectsInfo[key].ProjectID]!= undefined)
	             SITE_SURVEY_TYPE = surveyTypeIds[projectsInfo[key].ProjectID];
         else
             SITE_SURVEY_TYPE = app.config.defaultSurveyTypeID;   

                DALProjects.getProject(projectsInfo[key].ProjectID, function(tx, records){
                    if(records.rows.length <= 0){
                        projectManager.addProject(projectsInfo[key], SITE_SURVEY_TYPE, successAddProjectCallBack);
                    }                        
                });
                   	                            
        		// insert building data
            	buildingManager.insertAllBuildingData(projectsInfo[key], SITE_SURVEY_TYPE);
			});    

    };
    
    return projectManager;
});