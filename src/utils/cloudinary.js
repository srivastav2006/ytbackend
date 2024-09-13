import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
//fs is from node js used to manage fs
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_APIKEY,
    api_secret:process.env.CLOUDINARY_APISEC,
});

const uploadOnCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath) return null
       const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("file is uploaded",response.url);
        return response;
    }catch(error){
          fs.unlinkSync(localFilePath) //remove locally saved temp file as operation got failed
          return null;
    }
    
}
export {uploadOnCloudinary}
