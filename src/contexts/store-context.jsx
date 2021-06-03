import { createContext, useContext, useState } from "react";

export const StoreContext = createContext({});
export const SetStoreContext = createContext((val)=>{});

export function useStore() {
    return useContext(StoreContext);
}

export function useSetStore() {
    return useContext(SetStoreContext);
}

export function StoreProvider({children}) {
    const [store, setStore] = useState({});

    return (
        <StoreContext.Provider value={store}>
            <SetStoreContext.Provider value={setStore}>
                {children}
            </SetStoreContext.Provider>
        </StoreContext.Provider>
    );
}