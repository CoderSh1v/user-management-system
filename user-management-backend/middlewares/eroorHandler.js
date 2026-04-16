export const  errorhandler= (error,req,res,next)=>{
    if(error){
        res.status(400).json({error: error.message})
    }
}
//will update it for different errors later