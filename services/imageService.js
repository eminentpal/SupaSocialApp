export const getUserImageSrc = imagePath => {
    if (imagePath) {

       

        return {url: imagePath}
    }
    else{
        //console.log(imagePath)
        return require('../assets/images/defaultUser.png')
    
    }
}