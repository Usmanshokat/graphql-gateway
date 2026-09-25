const validationRequired =(value , fieldName)=>{
    if(!value || value.trim() === ""){
        throw new Error(`${fieldName} is requried`)
    }
};
export {
    validationRequired
}