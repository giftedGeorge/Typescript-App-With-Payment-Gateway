import jwt from 'jsonwebtoken';


function generateAccessToken(payload: object, expiresIn: string){
    const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY!;
    const expirationTimeInMinutes = expiresIn;

    const options = {
      expiresIn: `${expirationTimeInMinutes}m`,
    };
  
    return jwt.sign(payload, secretKey, options);
}

function generateRefreshToken(userId: string){
    const expirationTimeInMinutes = process.env.REFRESH_TOKEN_EXPIRATION_TIME!;

    return jwt.sign({
        userId: userId,
    }, process.env.REFRESH_TOKEN_SECRET_KEY!, {expiresIn: `${expirationTimeInMinutes}d`});
}

export {
    generateAccessToken,
    generateRefreshToken,
}