import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import ViewJSONModel, { ViewJSONModelData } from "../models/ViewJSONModel";
// import { ViewJSONModelData } from "../models/OLD_ViewJSONModel";
// import ViewJSONModel from "../models/OLD_ViewJSONModel";
import BaseView from "../views/BaseView";
import Router from "sap/m/routing/Router";

/**
 * Base class for all controllers
 *
 * @name cloudui5.controllers.BaseController
 */
export default abstract class BaseController<T extends ViewJSONModel<ViewJSONModelData>> extends Controller {

    protected oViewModel : T;

    /**
     * Constructor which gets called before the controller and the view are linked. Initializes the
     * ViewModel instance but will not attach it to the view until onInit() is called.
     *
     * @param sName
     */
    constructor(sName:string) {
        super(sName);

        this.oViewModel = this.initializeViewModel();
    }

    /**
     * Initializes the model to use on the view. Must be overridden on sub classes.
     * @param oViewModel
     */
    protected abstract initializeViewModel() : T;

    /**
     * Fired when the controller is initialized
     */
    public onInit() {
        let vw = <View>this.getView();
        // @ts-ignore
        let fnBeforeShow = vw.onBeforeShow;
        const that = this;

        // @ts-ignore
        vw.onBeforeShow = function(oEvent) {
            if ( fnBeforeShow )
                fnBeforeShow.apply(this, arguments);

            that.onBeforeShow(oEvent);
        };

        // validate that initializeViewModel was called on the constructor
        if ( !this.oViewModel ) {
            // @ts-ignore
            throw new Error(`Controller ${this.getMetadata().getName()} did not call initializeViewModel() on constructor `);
        }
        // @ts-ignore
        this.getView().setModel(this.oViewModel);
    }

    /**
     * Fired before the view is displayed.
     * @param oEvent
     */
    protected onBeforeShow(oEvent:any) {}

    /**
     * Helper function that returns the view's model.
     */
    public getViewModel() : T {
        if ( this.oViewModel == null) {
            console.error("Controller ", this, " does not have the ViewModel properly set; returning default model from view");
            // @ts-ignore
            return <T>this.getView().getModel();
        } else {
            return this.oViewModel;
        }
    }

    /**
     * Returns the view that is attached to this controller.
     * @returns 
     */
    public getView() : BaseView {
        return <any>super.getView();
    }

    /**
     * Helper function that returns the router for the current controller/view.
     */
    protected getRouter() : Router {
        // @ts-ignore
        return sap.ui.core.UIComponent.getRouterFor(this);
    }
}
