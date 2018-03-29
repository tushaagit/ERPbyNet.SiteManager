define(['jquery', 'cordova', 'config', 'fileHandler'],
    function ($, cordova, config, fileHandler) {

        var mediaHandler = {};
        mediaHandler.successCallback;
        mediaHandler.takeDirectPicture = function (e, mediaType, successCallback) {
        mediaHandler.successCallback = successCallback;
            if (e.dataItem.activity != undefined) {       // To identify the current Set/Group/Building/Project name
                mediaHandler.entityName = e.dataItem.activity;
            } /*else if (e.dataItem.GroupName != undefined) {

                mediaHandler.entityName = e.dataItem.GroupName;
            } else if (e.dataItem.BuildingName != undefined) {

                mediaHandler.entityName = e.dataItem.BuildingName;
            } else if (e.dataItem.ProjectName != undefined) {

                mediaHandler.entityName = e.dataItem.ProjectName;
            }*/

            mediaHandler.mediaType = mediaType;
            mediaHandler.uid = e.dataItem.RowGUID;
            var medTyp = 1;
            if (mediaHandler.mediaType != 'i')
                medTyp = 2;
                alert(mediaHandler.uid); alert(medTyp);
            fileHandler.getMediaFilesCount(mediaHandler.uid, medTyp, function (count) {
                if (count > 0) {
                    count = parseInt(count) + 1;
                    mediaHandler.fileName = mediaHandler.entityName + " " + count;
                } else {
                    mediaHandler.fileName = mediaHandler.entityName + " 01";
                }

                try {

                    if (mediaHandler.mediaType == 'i') {
                        navigator.device.capture.captureImage(mediaHandler.captureSuccess,
                            mediaHandler.captureError,
                            {
                                limit: 1,
                                destinationType: navigator.camera.DestinationType,
                                quality: 50,
                                targetWidth: 500
                            }
                        );
                    } else {
                        navigator.device.capture.captureVideo(mediaHandler.captureSuccess,
                            mediaHandler.captureError,
                            {
                                limit: 1,
                                destinationType: navigator.camera.DestinationType
                            }
                        );
                    }
                }
                catch (err) {
                    alert(err.message);
                }
            });
        };


        mediaHandler.takeDirectSurveyPicture = function (rowGuid, entityName, mediaType, successCallback) {
        mediaHandler.successCallback = successCallback;

            mediaHandler.entityName = entityName;

            mediaHandler.mediaType = mediaType;
            mediaHandler.uid = rowGuid;
            var medTyp = 1;
            if (mediaHandler.mediaType != 'i')
                medTyp = 2;
            fileHandler.getMediaFilesCount(mediaHandler.uid, medTyp, function (count) {
                if (count > 0) {
                    count = parseInt(count) + 1;
                    mediaHandler.fileName = mediaHandler.entityName + " " + count;
                } else {
                    mediaHandler.fileName = mediaHandler.entityName + " 01";
                }

                try {

                    if (mediaHandler.mediaType == 'i') {
                        navigator.device.capture.captureImage(mediaHandler.captureSuccess,
                            mediaHandler.captureError,
                            {
                                limit: 1,
                                destinationType: navigator.camera.DestinationType,
                                quality: 50,
                                targetWidth: 500
                            }
                        );
                    } else {
                        navigator.device.capture.captureVideo(mediaHandler.captureSuccess,
                            mediaHandler.captureError,
                            {
                                limit: 1,
                                destinationType: navigator.camera.DestinationType
                            }
                        );
                    }
                }
                catch (err) {
                    alert(err.message);
                }
            });
        };


        mediaHandler.captureSuccess = function (mediaFiles) {
            for (var i = 0; i < mediaFiles.length; i++) {
                var path = mediaFiles[i].fullPath;
            }
            mediaHandler.path = path;
            alert(mediaHandler.path);
            if (mediaHandler.fileName.indexOf('.mp4') < 0 && mediaHandler.fileName.indexOf('.jpg') < 0) {
                var path = mediaHandler.path;
                var lastIndex = path.lastIndexOf(".");
                var extension = path.substring(lastIndex);
                mediaHandler.fileName = mediaHandler.fileName + extension;
            }

            try {
                fileHandler.doesFileExists(mediaHandler.uid, mediaHandler.fileName,
                    function (existance) {
                        if (existance == true) {
                            var conOverwrite = confirm(localizer.translateText("mediaGalleryView.overWriteConfirm"));
                            if (conOverwrite)
                                fileHandler.deleteFile(mediaHandler.uid, mediaHandler.fileName, function () {
                                    mediaHandler.copyFile(mediaHandler.fileName);
                                });
                        }
                        else
                            mediaHandler.copyFile(mediaHandler.fileName);
                    });
            }
            catch (e) {
                alert(e);
            }

        };


        mediaHandler.copyFile = function (paraFileName) {

            fileHandler.copyFile(mediaHandler.uid, mediaHandler.path, paraFileName, function () {
                mediaHandler.successCallback();
            });

        };

        mediaHandler.captureError = function (error) {
            console.log(error);
        }

        return mediaHandler;
    });
