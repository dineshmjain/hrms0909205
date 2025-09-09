
/**
 * for creating middle ware for spesific controller class
 * @param {controller to call} ControllerClass 
 * @param {function name which to call inside the controller} method 
 * @returns 
 */

export const controllerMiddleware = (ControllerClass,method) => {

    return  (request,response,next) => {

        const controller = new ControllerClass(request,response,next);
        return controller[method]();
    }
};