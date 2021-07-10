import Control from "sap/ui/core/Control";
import JSView from "sap/ui/core/mvc/JSView";
import JSONModel from "sap/ui/model/json/JSONModel";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * Abstract control to be extended on a view class file when that view
 * is intended to be used like a control under another view.
 * 
 * @name cloudui5.controls.ViewAsControl
 */
 export default abstract class ViewAsControl extends Control {
    protected abstract getViewName() : string;

    static metadata : { properties:any, aggregations?: any, events?: any } = {
        properties: {
            /** to be overriden by child controls */
        },
        aggregations: {
            /** Controls to show under this Div */
            _view: { type: "sap.ui.core.mvc.JSView", multiple: false, visibility: "private" },
        },
        events: {
        }
    };

    /**
     * Called during initialization
     */
    public init() {
        if ( this.getViewName() ) {
            // @ts-ignore
            this.setAggregation("_view", new JSView(<any>{ viewName: this.getViewName() }));
        } else {
            // @ts-ignore
            console.error("No view name defined for ", this.getMetadata().getName());
        }
    }


    /** Renderer for this control */
    static renderer : any = {
        render: (rm:RenderManager, oControl:ViewAsControl) => {
            const oView = oControl.getView();

            rm.write("<div");
            rm.writeControlData(oControl);

            rm.addClass("lbViewAsControl");
            rm.writeClasses();

            rm.write(">");

            rm.renderControl(oView);
            
            rm.write("</div>");

        }
    }

    /**
     * Override the setProperty of the control so that it automatically sets it on the model of the view.
     * @param sPropName 
     * @param vValue 
     * @param bSuppressRender 
     * @returns 
     */
    public setProperty(sPropName:string, vValue:any, bSuppressRender?:boolean) {
        console.log(`setting prop ${sPropName} with ${vValue}`);
        (<JSONModel>this.getView().getModel()).setProperty(`/${sPropName}`, vValue);

        return super.setProperty(sPropName, vValue, bSuppressRender);
    }

    /**
     * Returns the view aggregation
     * @returns 
     */
    public getView() {
        // @ts-ignore
        return <JSView>this.getAggregation("_view");
    }

    /**
     * Helper function where the metadata is created based on the paths on the model. 
     * The paths of the model is only applicable for models that have auto generated
     * code (@see https://github.com/tapsiturbi/ui5-ts-codegen )
     * 
     * @param modelPaths 
     * @returns 
     */
    public static createMetadataFromModelPaths(modelPaths : any) {
        const props = Object.keys(modelPaths);
        let metadataProps : any = {};

        for(const p of props) {
            metadataProps[p] = { type: "string" };
        }

        return {
            properties: metadataProps
        };
    }

}