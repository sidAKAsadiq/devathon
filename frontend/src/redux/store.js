import { configureStore } from "@reduxjs/toolkit"


export const store = configureStore({
  reducer: {
    userData:userDataReducer , 
    adsData: adsDataReducer,
    locationData :locationReducer , 
    searchFilter:  searchReducer,
    chatData: chatReducer,
    searchFilter:  searchReducer , 
    individualAd: individualAdReducer , 
    notifications: notificationsReducer , 
    transactions: transactionReducer , 
    viewAll : viewAllReducer
  },
})