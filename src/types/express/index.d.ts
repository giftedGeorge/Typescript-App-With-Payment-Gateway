export{};

declare global {
  namespace Express {
    export interface Request {
      user?: UserType
    }
  }
}

type UserType = {
  phoneNumber: string;
  id?: string;
  firstName?: string;
  lastName?: string;
};