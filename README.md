# cloudui5
Libraries for SAPUI5/OpenUI5 that helps in cloud (non-SAP FIORI, non SAP Web IDE) development


## What is CloudUI5?
CloudUI5 is a set of classes to be used on a SAPUI5/OpenUI5 project with the hopes of solving the following problems:

### Problem 1: not developer friendly
No auto complete, no type definitions, etc. Solved by Typescript
To Dos:
Create plugin on VSCode to auto create views/models/controls

### Problem 2: no explicit service layer
No specific mention on where to place REST api calls; solved by creating JSONModel subclasses

### Problem 3: need to know models by heart
Each control on a view needs to be bound to a model, so developers would need to know what the data structure is of that model. If there are around 10 or more controls, then the developers would need to know all those properties in the model.

Solved by ui5-ts-codegen (https://github.com/tapsiturbi/ui5-ts-codegen)

### Problem 4: hard to reuse views
Should provide a way similar to angular where parent view can use sub views as control

### Problem 5: hard to maintain manifests
Consider using annotations (ala Spring) when assigning routes to views and auto create manifests as part of build.


TODO:
- fix issue with ui5-ts-codegen when model has arrays
- ViewAsControl - figure out how to auto create mSettings parameter
- include sap definitions
- change from library-preload.json to library-preload.js
- npm package properly
