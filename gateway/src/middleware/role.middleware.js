import AppError from "../utils/appError.js"
const authorize = (...allowedRoles)=>{
    console.log(allowedRoles , 'check allowed roles')
    return(user)=>{
        if(!user){
            throw new AppError( "Authentication required","UNAUTHENTICATED")
        }
        if(!allowedRoles.includes(user.role)){
            throw new AppError("Access denied" , "FORBIDDEN")
        }
        return true;
    }
}
export default authorize;