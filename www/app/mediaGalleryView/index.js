'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'DALProjects', 'fileHandler', 'dropdown', 'imageView'],
    function ($, cordova, kendo, app, localizer, WSHandler, DALProjects, fileHandler, dropdown, imageView) {
        var fileListing = new Array();
        var mediaGalleryView = kendo.observable({
            beforeShow: function (e) {
                var $view = $('#' + e.view.content.context.id);
                if ($view.length > 0) {
                    app.removeCachedViews($view);
                }
            },
            onShow: function (e) {
                var chkLogin = app.isUserAuthenticated();//call for valid user check method in app page
                if (chkLogin == false) {//check for valid user session
                    app.mobileApp.navigate('app/loginView/view.html');//Not login then goto login page
                }
            },
            afterShow: function (e) {
                mediaGalleryView.mediaType = e.view.params.mediaType;
                var uid = e.view.params.RowGUID;
                if (e.view.params.SetName != undefined) {
                    $('#pageTitle').text(e.view.params.ProjectName + " > " + e.view.params.BuildingName + " > " + e.view.params.GroupName + " > " + e.view.params.SetName);
                    $('#entityName').val(e.view.params.SetName); // To identify the current Set/Group/Building/Project name
                } else if (e.view.params.GroupName != undefined) {
                    $('#pageTitle').text(e.view.params.ProjectName + " > " + e.view.params.BuildingName + " > " + e.view.params.GroupName);
                    $('#entityName').val(e.view.params.GroupName);
                } else if (e.view.params.BuildingName != undefined) {
                    $('#pageTitle').text(e.view.params.ProjectName + " > " + e.view.params.BuildingName);
                    $('#entityName').val(e.view.params.BuildingName);
                } else if (e.view.params.ProjectName != undefined) {
                    $('#pageTitle').text(e.view.params.ProjectName);
                    $('#entityName').val(e.view.params.ProjectName);
                }

                mediaGalleryView.init(uid, e.view.params.mediaType);
            }
        });

        mediaGalleryView.fileNameKeyDown = function (e) {
            if (e.keyCode == 13) {
                mediaGalleryView.saveMediaOnkeyPress();
            }
        }


        mediaGalleryView.set('fileName', '');

        app.mediaGalleryView = mediaGalleryView;

        mediaGalleryView.imageFileEntries = [];
        mediaGalleryView.pictureSource = null;
        mediaGalleryView.destinationType = null;

        mediaGalleryView.init = function (uid, mediaTyp) {
            localizer.translate();

            fileHandler.getMediaFilesPath(uid, 1, function (dirPath) {
                mediaGalleryView.sketchfolderPath = dirPath;
            });
            mediaGalleryView.sketchImageData = "";
            mediaGalleryView.sortField = "dateTimeDisplay";
            $("#ddl").val("dateTimeDisplay");
            mediaGalleryView.sortReverse = false;
            mediaGalleryView.drawSketch = false;
            var navbar = app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar");
            if (mediaTyp == 'i') {
                navbar.title(localizer.translateText("mediaGalleryView.imgGallery"));
                document.getElementById("dvTkVideo").style.display = 'none';
                document.getElementById("dvTkImage").style.display = 'block';
                document.getElementById("dvDwImage").style.display = 'block';
            }
            else {
                navbar.title(localizer.translateText("mediaGalleryView.vidGallery"));
                document.getElementById("dvTkImage").style.display = 'none';
                document.getElementById("dvTkVideo").style.display = 'block';
                document.getElementById("dvDwImage").style.display = 'none';
            }

            mediaGalleryView.uid = uid;
            $("#gallaryScroller").height((window.innerHeight * 90 / 100).toString() + "px"); //Set the height to 90% of the screen height
            $("#fileName").val('');
            mediaGalleryView.showPreviewButtons(false);
            mediaGalleryView.pictureSource = navigator.camera.PictureSourceType;
            mediaGalleryView.destinationType = navigator.camera.DestinationType;

            mediaGalleryView.showMediaFiles();
        };

        mediaGalleryView.clearPreviewImage = function () {
            var previewImage = document.getElementById('previewVideo');
            previewImage.src = '';
            var previewImage = document.getElementById('previewImg');
            previewImage.src = '';
        };

        mediaGalleryView.showMediaFiles = function () {
            try {
                var medTyp = 1;
                fileListing = [];
                if (mediaGalleryView.mediaType != 'i')
                    medTyp = 2;
                $("#imageAlbum").html("");

                fileHandler.getFiles(mediaGalleryView.uid, null, medTyp, function (filesList) {
                    fileListing = filesList;

                    if (mediaGalleryView.sortField == '') {
                        if (mediaGalleryView.sortReverse == true)
                            filesList = filesList.reverse();
                    }
                    else
                        filesList.sort(mediaGalleryView.sort());


                    mediaGalleryView.dataSource = new kendo.data.DataSource({
                        data: filesList,
                        type: "json"
                    });

                    $("#imageAlbum").innerHtml = "";

                    $("#imageAlbum").kendoMobileListView({
                        dataSource: mediaGalleryView.dataSource,
                        template: $("#imageGallaryTemplate").text()
                    });


                });
            }
            catch (ex) {
                alert(ex.message);
            }
            finally {
                //app.mobileApp.hideLoading();
            }
        };

        mediaGalleryView.takePicture = function () {
            // start image capture
            try {
                navigator.device.capture.captureImage(mediaGalleryView.captureSuccess,
                    mediaGalleryView.captureError,
                    {
                        limit: 1,
                        destinationType: mediaGalleryView.destinationType.DATA_URL,
                        quality: 50,
                        targetWidth: 500
                    }
                );
            }
            catch (err) {
                alert(err.message);
            }
        };

        mediaGalleryView.takeVideo = function () {
            // start video capture
            navigator.device.capture.captureVideo(mediaGalleryView.captureSuccess,
                mediaGalleryView.captureError,
                {
                    limit: 1,
                    destinationType: mediaGalleryView.destinationType.DATA_URL
                }
            );
        };

        mediaGalleryView.showPreviewButtons = function (show) {

            $("#saveSketchButton").hide();
            if (show == true) {
                $("#savePhotoButton").show();
                $("#discardPhotoButton").hide();
                $("#fileNameWrapper").show();
            }
            else {
                $("#savePhotoButton").hide();
                $("#discardPhotoButton").show();
                $("#fileNameWrapper").hide();
            }
        };

        mediaGalleryView.captureSuccess = function (mediaFiles) {
            $("#fileName").val("");
            for (var i = 0; i < mediaFiles.length; i++) {
                var path = mediaFiles[i].fullPath;
                $("#previewPath").text(path);
                fileHandler.getNativeURL(path, function (nativeURL) {
                    mediaGalleryView.setPreviewFile(nativeURL);
                    mediaGalleryView.showPreviewButtons(true);
                },
                    function (err) {
                        alert(localizer.translateText("mediaGalleryView.errorFileSystem") + " " + (JSON.stringify(err)));
                    });
            }
        };

        mediaGalleryView.setPreviewFile = function (URL) {
            mediaGalleryView.showImageVideo(URL, 'previewImg', 'previewVideo')
            $("#previewPopOver").data("kendoMobileModalView").open();
            var medTyp = 1;
            if (mediaGalleryView.mediaType != 'i')
                medTyp = 2;
            var cntFile = 0;
            try {
                if (fileListing.length > 0) {
                    for (var i = 0; i < fileListing.length; i++) {
                        var flieNameSplitter = fileListing[i].name.split(" ");
                        var flieExtSplitter = flieNameSplitter[flieNameSplitter.length - 1];
                        var fileCounter = flieExtSplitter.split(".");
                        if (cntFile < parseInt(fileCounter[0]))
                            cntFile = parseInt(fileCounter[0]);
                    }
                    cntFile = cntFile + 1;
                    cntFile = (cntFile < 10) ? ("0" + cntFile) : cntFile;
                    $("#fileName").val($('#entityName').val() + " " + cntFile);
                    mediaGalleryView.fileName = $('#entityName').val() + " " + cntFile;

                } else {
                    $("#fileName").val($('#entityName').val() + " 01");
                    mediaGalleryView.fileName = $('#entityName').val() + " 01";
                }

            } catch (e) { alert(e.message); }
        };

        // capture error callback
        mediaGalleryView.captureError = function (error) {
            if (error.code == '3') return;
            //alert(error.message);
            navigator.notification.alert(localizer.translateDynamicText("mediaGalleryView.errorCodeMsg", error.code), null, 'Capture Error');
        };

        mediaGalleryView.saveMediaOnkeyPress = function () {
            mediaGalleryView.validatable = $("#fileNameWrapper").kendoValidator().data("kendoValidator");
            if (!mediaGalleryView.validatable.validate()) return;

            var varfilename = '';

            if ($("#fileName").val().indexOf('.mp4') < 0 && $("#fileName").val().indexOf('.jpg') < 0) {
                var path = $("#previewPath").text();
                var lastIndex = path.lastIndexOf(".");
                var extension = path.substring(lastIndex);
                varfilename = $("#fileName").val() + extension;
            }

            try {
                fileHandler.doesFileExists(mediaGalleryView.uid, varfilename,
                    function (existance) {
                        if (existance == true) {
                            var conOverwrite = confirm(localizer.translateText("mediaGalleryView.overWriteConfirm"));
                            if (conOverwrite)
                                fileHandler.deleteFile(mediaGalleryView.uid, varfilename, function () {
                                    mediaGalleryView.copyFile(varfilename);
                                });
                        }
                        else
                            mediaGalleryView.copyFile(varfilename);
                    });
            }
            catch (e) {
                alert(e);
            }
        }

        mediaGalleryView.savePicture = function (e) {
            mediaGalleryView.validatable = $("#fileNameWrapper").kendoValidator().data("kendoValidator");
            if (!mediaGalleryView.validatable.validate()) return;
            if (mediaGalleryView.fileName.indexOf('.mp4') < 0 && mediaGalleryView.fileName.indexOf('.jpg') < 0) {
                var path = $("#previewPath").text();
                var lastIndex = path.lastIndexOf(".");
                var extension = path.substring(lastIndex);
                mediaGalleryView.fileName = mediaGalleryView.fileName + extension;
            }
            try {
                fileHandler.doesFileExists(mediaGalleryView.uid, mediaGalleryView.fileName,
                    function (existance) {
                        if (existance == true) {
                            var conOverwrite = confirm(localizer.translateText("mediaGalleryView.overWriteConfirm"));
                            if (conOverwrite)
                                fileHandler.deleteFile(mediaGalleryView.uid, mediaGalleryView.fileName, function () {
                                    mediaGalleryView.copyFile(mediaGalleryView.fileName);
                                });
                        }
                        else
                            mediaGalleryView.copyFile(mediaGalleryView.fileName);
                    });
            }
            catch (e) {
                alert(e);
            }
        };

        mediaGalleryView.discardPicture = function () {
            mediaGalleryView.clearPreviewImage();
            mediaGalleryView.showPreviewButtons(false);
            mediaGalleryView.closePreviewPicture();
        };

        mediaGalleryView.removePicture = function (e) {

            var data = e.button.data();
            var conDelete = confirm(localizer.translateText("mediaGalleryView.deleteConfirm"));
            if (conDelete) {
                fileHandler.deleteFile(mediaGalleryView.uid, data.imgname, function () {
                    //alert('File ' + data.imgname + ' is deleted');
                    //var msg = localizer.translateDynamicText("mediaGalleryView.fileDeletedMsg", data.imgname);
                    //alert(msg);
                    mediaGalleryView.closePreviewPicture();
                    mediaGalleryView.showMediaFiles();
                });
            }
        };

        mediaGalleryView.zoomPictureTouch = function (e) {
            mediaGalleryView.drawSketch = e.touch.target.data().drawsketch;
            mediaGalleryView.showZoomedPicture(e.touch.target.data().imgname, e.touch.target.data().imgurl);
        };

        mediaGalleryView.zoomPicture = function (e) {
            mediaGalleryView.drawSketch = e.button.data().drawsketch;
            mediaGalleryView.showZoomedPicture(e.button.data().imgname, e.button.data().imgurl);
        };

        mediaGalleryView.closeZoomPicture = function () {
            $("#zoomPopOver").data("kendoMobileModalView").close();
            document.getElementById('zoomedVideo').src = '';
        };

        mediaGalleryView.closePreviewPicture = function () {
            $("#previewPopOver").data("kendoMobileModalView").close();
        };

        mediaGalleryView.showZoomedPicture = function (imgName, imgUrl) {
            var sourceImage = document.getElementById(imgName);
            var URL = sourceImage.src;
            mediaGalleryView.showImageVideo(URL, 'zoomedImg', 'zoomedVideo')
            $('#zoomedImgName').text(imgName);
            $('#imgUrl').val(imgUrl);

            if (mediaGalleryView.mediaType != 'i') {
                var divcontrol = document.getElementById("divFullRes");
                divcontrol.style.display = 'none';
            }

            if(mediaGalleryView.drawSketch==true)
                mediaGalleryView.annotateZoomPicture();
            else
            $("#zoomPopOver").data("kendoMobileModalView").open();
        };

        mediaGalleryView.showImageVideo = function (URL, imgTagId, videoTagId) {
            var video = document.getElementById(videoTagId);
            var img = document.getElementById(imgTagId);
            if (fileHandler.isPicture(URL)) {
                video.style.display = 'none';
                video.src = '';
                img.style.display = 'Block';
                img.src = URL;
                $("#btnPen").show();
            }
            else {
                video.style.display = 'Block';
                video.src = URL
                img.style.display = 'none';
                img.src = '';
                $("#btnPen").hide();
            }
        };
        mediaGalleryView.removeExtension = function (name) {
            name.replace('.', '_')
        }

        mediaGalleryView.copyFile = function (paraFileName) {
            var path = $("#previewPath").text();
            fileHandler.copyFile(mediaGalleryView.uid, path, paraFileName, function () {
                app.tempAlert($("#previewPopOver"), localizer.translateText("mediaGalleryView.fileSavedMsg"), 3000);
                mediaGalleryView.clearPreviewImage();
                mediaGalleryView.showPreviewButtons(false);
                mediaGalleryView.closePreviewPicture();
                mediaGalleryView.showMediaFiles();
            });

        };

        mediaGalleryView.sort = function () {
            var key;
            //mediaGalleryView.sortField = mediaGalleryView.sortField =='type'? 'isPicture' : mediaGalleryView.sortField;
            mediaGalleryView.sortField;
            if (mediaGalleryView.sortField == 'name') {
                key = function (x) { return x[mediaGalleryView.sortField].toUpperCase() };
            }
            else {
                key = function (x) { return x[mediaGalleryView.sortField] };
            }

            mediaGalleryView.sortReverse = false;
            mediaGalleryView.sortReverse = !mediaGalleryView.sortReverse ? 1 : -1;


            return function (a, b) {
                return a = key(a), b = key(b), mediaGalleryView.sortReverse * ((a > b) - (b > a));
            }
        };

        mediaGalleryView.sortChange = function () {
            var value = $("#ddl").val();
            // value = value.toLowerCase();
            if (mediaGalleryView.sortField == value)
                mediaGalleryView.sortReverse = !mediaGalleryView.sortReverse;
            else {
                mediaGalleryView.sortField = value;
                mediaGalleryView.sortReverse = false;
            }
            mediaGalleryView.showMediaFiles();
        };

        mediaGalleryView.cancelSubmit = function (e) {
            //alert("called");
            alert(e.which);
            //alert(e.charCode);
        }

        mediaGalleryView.showFullResolution = function (e) {
            var url = $("#imgUrl").val();
            /*var imgctrl = document.getElementById('fullImg');
            imgctrl.src = url;
            //$('#fullImage').css("background-image",  url);
            $("#fullImage").data("kendoMobileModalView").open();*/
            //imageView
            app.mobileApp.navigate("app/imageView/view.html?imgUrl=" + url + "&uid=" + mediaGalleryView.uid + "&mdtype=" + mediaGalleryView.mediaType);
        };

        mediaGalleryView.annotateZoomPicture = function (e) {
            //console.log(e.button.data());
            var image = $("#zoomedImg");
            //alert( image.attr('src'));
            try {
                navigator.sketch.getSketch(mediaGalleryView.onSketchSuccess, mediaGalleryView.onSketchFail, {
                    destinationType: navigator.sketch.DestinationType.DATA_URL,
                    encodingType: navigator.sketch.EncodingType.JPEG,
                    inputType: navigator.sketch.InputType.FILE_URI,
                    inputData: image.attr('src')
                });
            }
            catch (e) {
                //alert(e.toString());
            }
        };
        mediaGalleryView.onSketchSuccess = function (imageData) {
            if (imageData == null || imageData==undefined || imageData=="") { return; }
            setTimeout(function () {
                // do your thing here!

                if (imageData.indexOf("data:image") >= 0) {
                    imageData = imageData.replace("data:image/png;base64,", "");
                }
                if (imageData.indexOf("data:image") >= 0) {
                    imageData = imageData.replace("data:image/jpeg;base64,", "");
                }
                //alert(imageData);
                if (mediaGalleryView.drawSketch == false) {
                    var image = $("#zoomedImg");
                    var imagePath = image.attr('src');
                    var folderPath, fileName;
                    imagePath.replace(/^(.*\/)?([^/]*)$/, function (_, dir, file) {
                        folderPath = dir; fileName = file;
                    });
                    var temp = fileName.split("?");
                    fileName = temp[0];
                    //alert(folderPath);
                    //alert(fileName);

                    try {
                        fileName = decodeURI(fileName);
                        fileHandler.savebase64AsImageFile(folderPath, fileName, imageData, "data:image/png;base64", function (evt) {

                            //image.attr('src', "data:image/png;base64," + imageData);
                            var imageName = $('#zoomedImgName').text();

                            mediaGalleryView.closeZoomPicture();
                            //mediaGalleryView.showZoomedPicture(imageName, imagePath);
                            mediaGalleryView.showMediaFiles();
                            //app.mobileApp.navigate("app/imageView/view.html?imgUrl=" + imagePath);
                        });
                        mediaGalleryView.closeZoomPicture();
                        mediaGalleryView.showMediaFiles();
                    }
                    catch (e) {
                        alert(e.toString());
                    }

                } else {

                    mediaGalleryView.closeZoomPicture();
                    mediaGalleryView.mediaType = 'i';
                    mediaGalleryView.setPreviewFile(mediaGalleryView.sketchfolderPath);
                    mediaGalleryView.showPreviewButtons(true);
                    //$(".previewImg").src = "";
                    $(".previewImg").hide();
                    //$("#zoomedImg").hide();
                    $("#saveSketchButton").show();
                    $("#savePhotoButton").hide();
                    mediaGalleryView.sketchImageData = imageData;
                    mediaGalleryView.clearPreviewImage();
                }

                /*if(imageData.indexOf("data:image") >= 0 ) {
                    image.attr('src', imageData);
                }
                else {
                    image.attr('src', "data:image/png;base64," + imageData);
                }*/

            }, 0);
        };
        mediaGalleryView.onSketchFail = function (message) {
            alert(localizer.translateText("mediaGalleryView.sketchFail") + " " + message);
            setTimeout(function () {
                console.log('plugin message: ' + message);
            }, 0);
        }


        mediaGalleryView.hideNote = function(){
               $(".rightDivWidth").fadeOut(2000);
            };

        mediaGalleryView.saveSketch = function () {
            try {
                var fileName = $("#fileName").val() + ".jpg";
                fileHandler.savebase64AsImageFile(mediaGalleryView.sketchfolderPath, fileName, mediaGalleryView.sketchImageData, "data:image/png;base64", function (evt) {

                });
                $("#saveSketchButton").hide();
                $("#savePhotoButton").show();
                mediaGalleryView.showMediaFiles();
                mediaGalleryView.clearPreviewImage();
                mediaGalleryView.showPreviewButtons(false);
                mediaGalleryView.closePreviewPicture();
                $(".previewImg").show();
            }
            catch (e) {
                alert(e.toString());
            }

        }


        return mediaGalleryView;
    });
// START_CUSTOM_CODE_settingsView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
// END_CUSTOM_CODE_settingsView
