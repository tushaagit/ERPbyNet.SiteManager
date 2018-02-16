define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'DALProjects', 'DALBuildings', 'DALGroups', 'DALSets'],
  function($, cordova, kendo, app, localizer, WSHandler, DALProjects, DALBuildings, DALGroups, DALSets) {

    var setManager = {};

    setManager.addSet = function(setsOfThisGroups) {
      var surveyVersionNo = 1;
      DALSets.addSet(setsOfThisGroups.ProjectID, setsOfThisGroups.BuildingID, setsOfThisGroups.GroupID, setsOfThisGroups.SetID,
        setsOfThisGroups.SetNo, setsOfThisGroups.SetName,
        setsOfThisGroups.OldProductTypeID, setsOfThisGroups.NewProductTypeID,
        setsOfThisGroups.NoOfUnits, setsOfThisGroups.Status,
        setsOfThisGroups.PercentComplete, setsOfThisGroups.Notes, setsOfThisGroups.RowGuid, surveyVersionNo);
    }

    setManager.insertAllSetData = function(groupsInfo, surveyTypeID) {
      var setsOfThisGroups = groupsInfo.Sets;
      $.each(setsOfThisGroups, function(setKey, setValue) {
        //check if set already exists, if not insert set data
        DALSets.getSet(setsOfThisGroups[setKey].ProjectID, setsOfThisGroups[setKey].BuildingID,
          setsOfThisGroups[setKey].GroupID, setsOfThisGroups[setKey].SetID,
          function(tx, records) {
            if (records.rows.length <= 0) {
              setManager.addSet(setsOfThisGroups[setKey]);
              // add form applicability
            }
          });
      });


    };
    return setManager;
  });
