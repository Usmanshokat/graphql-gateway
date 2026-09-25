import AppError from "./appError.js";

const validationRequired =(value , fieldName)=>{
    if(!value || value.trim() === ""){
        throw new AppError(`${fieldName} is required`, "BAD_USER_INPUT")
    }
};
export {
    validationRequired
}