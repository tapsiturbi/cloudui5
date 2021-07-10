import JSView from "sap/ui/core/mvc/JSView";
import Control from "sap/ui/core/Control";
import Controller from "sap/ui/core/mvc/Controller";

/**
 * Base view class that is inherited by all other views.
 *
 * @name cloudui5.view.BaseView
 */
export default abstract class BaseView extends JSView {

    public abstract getControllerName() : string;
    public abstract createContent(oController? : Controller) : Control;


    public static toJSON(): any {
        let jsonObject = {};
        let aKeys = Object.getOwnPropertyNames(this.prototype);
        let aSuperKeys = Object.getOwnPropertyNames(JSView.prototype);
        const that = this;

        aKeys.forEach(key => {
            if (aSuperKeys.indexOf(key) == -1) {
                //@ts-ignore
                jsonObject[key] = that.prototype[key];
            }
        });

        return jsonObject;
    }

}
