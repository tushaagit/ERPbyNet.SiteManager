define(['jquery', 'cordova', 'config'],
    function ($, cordova, config) {

        var fileHandler = {};

        fileHandler.getFiles = function (uid, filter, type, successHandler) {
            if (window.navigator.simulator === true) {
                var uidFiles = [];
                if (type == 1) {
                    uidFiles.push({
                        "name": 'Sample1.jpg',
                        "fullPath": 'images/Sample1.jpg',
                        "nativeURL": 'images/Sample1.jpg',
                        "isPicture": true,
                        "toURL": 'images/Sample1.jpg',
                        "dateTimeDisplay": ""
                    });
                    uidFiles.push({
                        "name": 'Sample2.jpg',
                        "fullPath": 'images/Sample2.jpg',
                        "nativeURL": 'images/Sample2.jpg',
                        "isPicture": true,
                        "toURL": 'images/Sample2.jpg',
                        "dateTimeDisplay": ""

                    });
                    uidFiles.push({
                        "name": 'Sample3.jpg',
                        "fullPath": 'images/Sample2.jpg',
                        "nativeURL": 'images/Sample2.jpg',
                        "isPicture": true,
                        "toURL": 'images/Sample2.jpg',
                        "dateTimeDisplay": ""

                    });
                    uidFiles.push({
                        "name": 'Sample4.jpg',
                        "fullPath": 'images/Sample2.jpg',
                        "nativeURL": 'images/Sample2.jpg',
                        "isPicture": true,
                        "toURL": 'images/Sample2.jpg',
                        "dateTimeDisplay": ""

                    });
                    uidFiles.push({
                        "name": 'Sample5.jpg',
                        "fullPath": 'images/Sample2.jpg',
                        "nativeURL": 'images/Sample2.jpg',
                        "isPicture": true,
                        "toURL": 'images/Sample2.jpg',
                        "dateTimeDisplay": ""

                    });
                }
                else {
                    uidFiles.push({
                        "name": 'SampleVid.mp4',
                        "fullPath": 'images/SampleVid.mp4',
                        "nativeURL": 'images/SampleVid.mp4',
                        "isPicture": false,
                        "toURL": 'images/SampleVid.mp4',
                        "dateTimeDisplay": ""

                    });
                }
                successHandler(uidFiles);
            }
            else {
                window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(),
                    function onSuccess(appDirEntry) {
                        appDirEntry.getDirectory(uid,
                            {
                                create: true,
                                exclusive: false
                            },
                            function (uidDirectoryEntry) {
                                
                                //Read the image files into an array
                                // Get a directory reader
                                var directoryReader = uidDirectoryEntry.createReader();

                                // Get a list of all the entries in the directory
                                directoryReader.readEntries(function (uidFileEntries) {
                                    var uidFiles = [];
                                    try {

                                        var cnt = 0; var ignoredCount = 0; var counter = 0;
                                        for (var i = 0; i < uidFileEntries.length; i++) {
                                            uidFileEntries[i].getMetadata(fileHandler.buildMetadataResultsCallback(uidFiles, filter, type, uidFileEntries[i], i, uidFileEntries.length, successHandler));
                                        };

                                    } catch (e) {
                                        alert('fileHandler.getFiles ' + e.message);
                                    }
                                });
                            },
                            function (err) {
                                alert('fileHandler.getFiles ' + err.message);
                            });
                    },
                    function () {
                        alert("failed to create/get directory");
                    });
            }
        };
        fileHandler.buildMetadataResultsCallback = function (filesArray, filter, type, fileEntry, counter, totalCount, successHandler) {
            return function (metadata) {
                fileHandler.medatadataResultsCallback(metadata, filter, type, filesArray, fileEntry, counter, totalCount, successHandler);
            };
        };


        fileHandler.medatadataResultsCallback = function (metadata, filter, type, filesArray, fileEntry, counter, totalCount, successHandler) {
            try {
                if ((filter == null || fileEntry.name.indexOf(filter) >= 0)
                    && ((type == 1 && fileHandler.isPicture(fileEntry.name)))
                    || (type == 2 && fileHandler.isVideo(fileEntry.name))) {
                    filesArray.push({
                        "name": fileEntry.name,
                        "fullPath": fileEntry.fullPath,
                        "nativeURL": fileEntry.nativeURL + "?" + Math.random(),
                        "isPicture": fileHandler.isPicture(fileEntry.name),
                        "toURL": fileEntry.toURL(),
                        "dateTimeDisplay": metadata.modificationTime
                    });
                }
            }
            catch (e) { console.log(e.message); }
            
            if (counter === (totalCount - 1)) {
                
                successHandler(filesArray);
            }
        };

        fileHandler.isPicture = function (fileName) {
            var isPicture = fileName.indexOf(".jpg") >= 0 ? true : false;
            return isPicture;
        };

        fileHandler.isVideo = function (fileName) {
            var isVideo = (fileName.indexOf(".mp4") >= 0 || fileName.indexOf(".3gp") >= 0) ? true : false;
            return isVideo;
        };

        fileHandler.deleteFile = function (uid, fileName, successHandler) {
            window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(),
                function onSuccess(appDirEntry) {
                    appDirEntry.getDirectory(uid,
                        {
                            create: true,
                            exclusive: false
                        },
                        function (directoryEntry) {
                            directoryEntry.getFile(fileName, { create: false, exclusive: false },
                                function (fileEntry) {
                                    fileEntry.remove(successHandler, null);
                                },
                                function () {
                                    alert('Failed to locate the file.')
                                });
                        },
                        null);
                },
                null);
        };

        fileHandler.doesFileExists = function (uid, fileName, successHandler) {
            window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(),
                function onSuccess(appDirEntry) {
                    appDirEntry.getDirectory(uid,
                        {
                            create: true,
                            exclusive: false
                        },
                        function (directoryEntry) {

                            directoryEntry.getFile(fileName, { create: false, exclusive: false },
                                function (fileEntry) {
                                    if (fileEntry) {
                                        successHandler(true);
                                    }
                                    else
                                        successHandler(false);
                                },
                                function () {
                                    successHandler(false);
                                });
                        },
                        null);
                },
                null);
        };

        fileHandler.copyFile = function (uid, path, fileName, successHandler) {
            if (path.indexOf('file:') == -1)
                path = "file://" + path;
            window.resolveLocalFileSystemURL(path, function (fileEntry) {
                window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(),
                    function onSuccess(appDirEntry) {
                        appDirEntry.getDirectory(uid,
                            {
                                create: true,
                                exclusive: false
                            },
                            function (uidDirectoryEntry) {
                                fileEntry.copyTo(uidDirectoryEntry, fileName,
                                    successHandler(),
                                    function () {
                                        alert('unsuccessful copying')
                                    });
                            },
                            function () {
                                alert("failed to create directory");
                            });
                    }, null);
            }, function (err) {
                alert('### ERR: filesystem.directoryUp() - ' + (JSON.stringify(err)));
            });
        }

        fileHandler.getNativeURL = function (path, successHandler) {
            if (path.indexOf('file:') == -1)
                path = "file://" + path;
            window.resolveLocalFileSystemURL(path, function (fileEntry) {
                //var nativeURL = fileEntry.nativeURL.replace("\\\", "\\");
                //alert('nativeURL ' + nativeURL);                                            
                successHandler(fileEntry.nativeURL);
            },
                function (err) {
                    alert('fileHandler.getNativeURL ' + JSON.stringify(err));
                });
        };

        fileHandler.getAppFilesRoot = function () {
            var devicePlatform = device.platform;
            switch (devicePlatform) {
                case "Android":
                    return cordova.file.applicationStorageDirectory;
                    break;
                case "iOS":
                    //alert(cordova.file.documentsDirectory);
                    //return cordova.file.applicationStorageDirectory + "/Documents";
                    return cordova.file.documentsDirectory;
                    break;
            }
        };

        fileHandler.getMediaFilesCount = function (uid, type, successCallback) {
            //type:: 1: picture, 2: video
            if (window.navigator.simulator === true) {
                successCallback(3);
            }
            else {

                window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(),
                    function onSuccess(appDirEntry) {

                        appDirEntry.getDirectory(uid,
                            {
                                create: true,
                                exclusive: false
                            },
                            function (uidDirectoryEntry) {

                                //Read the image files into an array
                                // Get a directory reader
                                var directoryReader = uidDirectoryEntry.createReader();
                                // Get a list of all the entries in the directory
                                directoryReader.readEntries(function (uidFileEntries) {
                                    var uidFiles = [];
                                    var fileCount = 0;
                                    for (var i = 0; i < uidFileEntries.length; i++) {
                                        if ((type == 1 && fileHandler.isPicture(uidFileEntries[i].name)) || (type == 2 && fileHandler.isVideo(uidFileEntries[i].name))) {

                                            fileCount++;
                                        }
                                    };
                                    successCallback(fileCount);
                                },
                                    function () {
                                        successCallback(0);;
                                    });
                            },
                            function (err) {
                                alert('fileHandler.getMediaFilesCount ' + err.message);
                            });
                    },
                    function () {
                        alert("failed to create/get directory");
                    });
            }
        }

        fileHandler.downloadAttributeImagesFromServer = function (sourceURL, targetFileName, callbackFunction) {
            if (window.navigator.simulator === true) {
                callbackFunction(sourceURL);
            }
            else {
                var fileTransfer = new FileTransfer();

                var uri = encodeURI(sourceURL);
                window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(),
                    function onSuccess(rootFolderEntry) {
                        //alert(rootFolderEntry.fullPath);
                        rootFolderEntry.getDirectory(config.attributeFilesFolder,
                            {
                                create: true,
                                exclusive: false
                            },
                            function (targetFolderEntry) {
                                var targetFullPath = fileHandler.getAppFilesRoot() + config.attributeFilesFolder + '/';
                                //alert(targetFullPath + targetFileName);
                                fileTransfer.download(
                                    sourceURL,
                                    targetFullPath + targetFileName,
                                    function (savedFileEntry) {
                                        //app.notify("download complete: " + savedFileEntry.toURL());
                                        //alert(savedFileEntry.toURL());
                                        callbackFunction(savedFileEntry.toURL());
                                    },
                                    function (error) {
                                        //app.notify("download error source " + error.source);
                                        //app.notify("download error target " + error.target);
                                        //app.notify("upload error code" + error.code);
                                        alert('fileHandler.downloadAttributeImagesFromServer Error ' + error.code + ' Source: ' + sourceURL + ', Target: ' + targetFullPath + targetFileName);
                                        callbackFunction(sourceURL);
                                    },
                                    true
                                );
                            },
                            function (error) {
                                // app.notify("Failed to create directory. Error code: " + error.code);
                            });
                    },
                    null);
            }
        };

        fileHandler.copyFileInNewDir = function (source, desitination, callbackFunction) {
            //alert("S: "+ source +" D: "+ desitination);
            if (window.navigator.simulator === true) {
                if (callbackFunction != null) callbackFunction();
            }
            else {
                window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(),
                    function (appDirEntry) {
                        //alert('got main folder!!!');
                        appDirEntry.getDirectory(source,
                            {
                                create: true,
                                exclusive: false
                            },
                            function (srcDirectoryEntry) {
                                //alert('got source folder');
                                //Read the image files into an array
                                // Get a directory reader
                                var directoryReader = srcDirectoryEntry.createReader();
                                // Get a list of all the entries in the directory
                                directoryReader.readEntries(
                                    function (uidFileEntries) {
                                        //lert('got file');
                                        appDirEntry.getDirectory(desitination,
                                            {
                                                create: true,
                                                exclusive: true
                                            },
                                            function (destDirectoryEntry) {
                                                //alert(uidFileEntries.length);
                                                for (var i = 0; i < uidFileEntries.length; i++) {
                                                    //alert(uidFileEntries[i].name + " from: "+ source +" to : "+ desitination);
                                                    if (fileHandler.isPicture(uidFileEntries[i].name) || fileHandler.isVideo(uidFileEntries[i].name)) {
                                                        uidFileEntries[i].copyTo(destDirectoryEntry, uidFileEntries[i].name);
                                                        if (callbackFunction != null) callbackFunction();
                                                    }
                                                };
                                            },
                                            function (err) {
                                                alert(err.message);
                                            }
                                        );


                                    },
                                    function () {
                                        if (callbackFunction != null) callbackFunction();;
                                    }
                                );
                            },
                            function (err) {
                                alert(err.message);
                            }
                        );

                    },
                    function (err) {
                        alert(err.message);
                    }
                );
            }

        };

        fileHandler.uploadMediaToServer = function (source, location, callbackFunction) {
            //alert("uploading" + source);
            if (window.navigator.simulator === true) {
                callbackFunction(0);
            }
            else {
                window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(),
                    function (appDirEntry) {
                        //alert(appDirEntry.name); 
                        appDirEntry.getDirectory(source,
                            {
                                create: false,
                                exclusive: false
                            },
                            function (srcDirectoryEntry) {
                                //if(srcDirectoryEntry.name.indexOf('74a1') > -1)
                                //    alert(srcDirectoryEntry.fullPath);    
                                //Read the image files into an array
                                // Get a directory reader
                                var directoryReader = srcDirectoryEntry.createReader();
                                var cnt = 0;
                                // Get a list of all the entries in the directory
                                directoryReader.readEntries(
                                    function (uidFileEntries) {
                                        var files = uidFileEntries;
                                        for (var i = 0; i < uidFileEntries.length; i++) {
                                            //alert("found " + uidFileEntries.length);
                                            cnt++;
                                            //alert(location + " ::::: " + uidFileEntries[i].toURL());
                                            fileHandler.uploadPhoto(uidFileEntries[i], location, callbackFunction);
                                            //WSHandler.postFileStream(uidFileEntries[0]);
                                        }
                                        //return files;
                                    },
                                    function () {
                                        if (callbackFunction != null) callbackFunction(cnt);
                                    });
                            },
                            function (err) {

                            });


                    },
                    function (err) {

                    });
            }
        };

        fileHandler.uploadPhoto = function (image, fileLocation) {
            //alert(image.toURL());
            var imageURI = image.toURL();

            var options = new FileUploadOptions();
            options.headers = {
                Connection: "close"
            }
            options.chunkedMode = false;
            options.fileKey = "file";
            var imagefilename = imageURI;
            options.fileName = imagefilename.substr(imageURI.lastIndexOf('/') + 1);

            if (imageURI.indexOf(".jpg") >= 0)
                options.mimeType = "image/jpeg";
            else if (imageURI.indexOf(".mp4") >= 0)
                options.mimeType = "video/mp4";
            else if (imageURI.indexOf(".3gp") >= 0)
                options.mimeType = "video/3gpp";
            var params = {};
            params.fileLocation = fileLocation;

            options.params = params;

            var ft = new FileTransfer();

            ft.upload(imageURI, config.servicePath + "SaveImage/", fileHandler.win, fileHandler.fail, options);

        };

        /**
         * Convert a base64 string in a Blob according to the data and contentType.
         * 
         * @param b64Data {String} Pure base64 string without contentType
         * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
         * @param sliceSize {Int} SliceSize to process the byteCharacters
         * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
         * @return Blob
         */
        fileHandler.b64toBlob = function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        };

        /**
         * Create a Image file according to its database64 content only.
         * 
         * @param folderpath {String} The folder where the file will be created
         * @param filename {String} The name of the file that will be created
         * @param content {Base64 String} Important : The content can't contain the following string (data:image/png[or any other format];base64,). Only the base64 string is expected.
         */
        fileHandler.savebase64AsImageFile = function (folderpath, filename, content, contentType, callback) {
            // Convert the base64 string in a Blob
            var DataBlob = fileHandler.b64toBlob(content, contentType);

            console.log("Starting to write the file :3");

            window.resolveLocalFileSystemURL(folderpath, function (dir) {
                console.log("Access to the directory granted succesfully");
                dir.getFile(filename, { create: true }, function (file) {
                    console.log("File created succesfully.");
                    file.createWriter(function (fileWriter) {
                        fileWriter.onWriteEnd = function (evt) {
                            //alert('in fileWriter.onWriteEnd');
                            callback();
                        }
                        //alert("Writing content to file");

                        fileWriter.write(DataBlob);

                    }, function () {
                        alert('Unable to save file in path ' + folderpath);
                    });
                });
            });
        }
        fileHandler.win = function (r) {
            //alert(jQuery.type(r));
            //alert(r.response);

        };

        fileHandler.fail = function (error) {
            alert('upload error: ' + error.code + ": " + error.http_status + " ; source " + error.source + " ; target " + error.target);
        };


        fileHandler.getMediaFilesPath = function (uid, type, successCallback) {
            //type:: 1: picture, 2: video
            if (window.navigator.simulator === true) {
                successCallback('images/');
            }
            else {

                window.resolveLocalFileSystemURL(fileHandler.getAppFilesRoot(),
                    function onSuccess(appDirEntry) {

                        appDirEntry.getDirectory(uid,
                            {
                                create: true,
                                exclusive: false
                            },
                            function (uidDirectoryEntry) {                               
                                // Get a directory reader
                                var directoryReader = uidDirectoryEntry.createReader();                                

                                successCallback(directoryReader.localURL);
                            },
                            function (err) {
                                alert('fileHandler.getMediaFilesPath ' + err.message);
                            });
                    },
                    function () {
                        alert("failed to create/get directory");
                    });
            }
        }

        return fileHandler;
    });