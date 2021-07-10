/**
 * Initialization Code and shared classes of library cloudui5
 */
 sap.ui.define(['sap/ui/core/library'], function(Library) {
	"use strict";

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
        name : "cloudui5",
        version : "1.00.0",
        dependencies : ["sap.ui.core"],
        types : [  ],
        interfaces: [ ],
        controls: [ ],
        elements: [ ],
        noLibraryCSS: true,
    });

}, /* bExport= */false);

