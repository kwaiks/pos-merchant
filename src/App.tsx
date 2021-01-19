import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { push } from 'connected-react-router';
// layouts

import Admin from "layout/MainLayout";
import Auth from "layout/Auth";

import Login from "views/auth/Login";
import Register from "views/auth/Register";

import Dashboard from "views/admin/Dashboard";
import Store from "views/admin/store/StoreEdit";

import { store } from "store";
import { APP_LOAD, REDIRECT } from 'store/constants/actionTypes';
import Gallery from "views/admin/store/Gallery";
import MenuList from "views/admin/menu/MenuList";
import Menu from "views/admin/menu/Menu";
import InventoryList from "views/admin/inventory/InventoryList";
import Inventory from "views/admin/inventory/Inventory";
import Category from "views/admin/category/Category";


const mapStateToProps = (state:any) => {
    return {
        appLoaded: state.common.appLoaded,
        appName: state.common.appName,
        currentUser: state.common.currentUser,
        redirectTo: state.common.redirectTo,
        currentStore: state.common.currentStore
    }};

    const mapDispatchToProps = (dispatch:any) => ({
    onLoad: (payload:any, token:string, stores:any, currentStore: any) =>
        dispatch({ type: APP_LOAD, payload, token, stores, currentStore, skipTracking: true }),
    onRedirect: () =>
        dispatch({ type: REDIRECT })
});

const App = (props:any) => {

    useEffect(()=>{
        if(props.redirectTo){
            console.log(props.redirectTo)
            store.dispatch(push(props.redirectTo));
            props.onRedirect();
        }
    },[props]);

    // ComponentDidMount
    useEffect(()=>{
        const user = localStorage.getItem("u_");
        const stores = localStorage.getItem("s_");
        const cStorage = localStorage.getItem("c_s_");
        const currentStore = cStorage ? JSON.parse(cStorage) : ( stores ? JSON.parse(stores)[0] : null)
        if (user) {
            props.onLoad(
                user, 
                "", 
                stores? JSON.parse(stores) : [], 
                currentStore
            )
        }else {
            props.onLoad(null, "", []);
            // store.dispatch(push("/login"));
            // props.onRedirect();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <>
            <Switch>
                {
                    props.currentUser === null || typeof props.currentUser === "undefined" ?
                    <Auth>
                        <Switch>
                            <Route path="/login" exact component={Login} />
                            <Route path="/register" exact component={Register} />
                            {
                                props.appLoaded ? 
                                <Redirect from="*" to="/login" /> : 
                                null
                            }
                        </Switch>
                    </Auth> :
                    <Admin>
                        <Switch>
                            <Route path="/dashboard" exact component={Dashboard} />
                            <Route path="/info" component={Store} />
                            <Route path="/gallery" exact component={Gallery} />
                            <Route path="/menu" exact component={MenuList} />
                            <Route path="/menu/:method/:id?" exact component={Menu} />
                            <Route path="/inventory" exact component={InventoryList} />
                            <Route path="/inventory/:method/:id?" exact component={Inventory} />
                            <Route path="/category" exact component={Category} />
                            <Redirect from="*" to="/dashboard" />
                        </Switch>
                    </Admin>
                }
            {/* add redirect for first page */}
            </Switch>
        </>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(App);