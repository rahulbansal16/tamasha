import { FIREASE_STORAGE_URL_END, FIREBASE_STORAGE_URL_START } from "../Const"

  

export const getFirebaseImageURL = (name) => {
    return FIREBASE_STORAGE_URL_START + name + FIREASE_STORAGE_URL_END
}