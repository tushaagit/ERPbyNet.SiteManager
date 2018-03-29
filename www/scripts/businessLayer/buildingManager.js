define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'groupManager', 'DALProjects', 'DALBuildings', 'DALGroups', 'DALSets'],
       function ($, cordova, kendo, app, localizer, WSHandler, groupManager, DALProjects, DALBuildings, DALGroups, DALSets) {

    var buildingManager = {};

    buildingManager.addBuilding = function(buildingsOfThisProject){
         DALBuildings.addBuilding(buildingsOfThisProject.ProjectID, buildingsOfThisProject.BuildingID,
                                            buildingsOfThisProject.BuildingNo,buildingsOfThisProject.BuildingName,
                                            1,buildingsOfThisProject.PercentComplete, buildingsOfThisProject.Notes, buildingsOfThisProject.RowGuid);

    }

    buildingManager.insertAllBuildingData = function(projectsInfo, surveyTypeID){
            	var buildingsOfThisProject = projectsInfo.Buildings;
            	$.each( buildingsOfThisProject, function( buildingKey, buildingValue ) {
                    	//check if building already exists, if not insert building data
                    DALBuildings.getBuilding(buildingsOfThisProject[buildingKey].ProjectID, buildingsOfThisProject[buildingKey].BuildingID,
                                         function(tx, records){
                                            if(records.rows.length <= 0){
                                                buildingManager.addBuilding(buildingsOfThisProject[buildingKey]);
                                            }
               		 });
                    // insert group data
					groupManager.insertAllGroupData(buildingsOfThisProject[buildingKey], surveyTypeID);
                });

    };
    return buildingManager;
});
