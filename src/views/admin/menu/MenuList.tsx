import Table from "components/Table/Table";
import React from "react";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { LOAD_MENUS } from "store/constants/actionTypes";
import { getStoreMenu } from "api/menu";
import { BASE_PUBLIC_URL } from "config/appConfig";
import { formatCurrency } from "utils/currencyFormatter";

const mapStateToProps = (state:any) => ({
    currentStore: state.common.currentStore,
    menu: state.menu
});

const mapDispatchToProps = (dispatch: any) => ({
    loadMenus: async (storeId: number) =>
        dispatch({type: LOAD_MENUS, payload: getStoreMenu(storeId)})
});

const MenuList = (
    {currentStore, menu, loadMenus}:
    {currentStore: any, menu: any, loadMenus: Function}
    ) => {
    const [data, setData] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const columns = React.useMemo<Column[]>(()=>
        [
            {
                Header: '',
                accessor: 'menuPhoto',
                Cell: ({value}:any)=> (
                    <img className="w-16 h-16 object-cover" src={BASE_PUBLIC_URL+value} alt={value}/> 
                )
            },
            {
                Header: 'Name',
                accessor: 'menuName',
            },
            {
                Header: 'Stock',
                accessor: 'menuStock'
            },
            {
                Header: 'Price',
                accessor: (d:any) => `${formatCurrency(d.menuPrice)}`
            },
            {
                Header: 'Action',
                accessor: 'id',
                Cell: ({value}:any) => (
                    <Link to={`/menu/edit/${value}`}>
                        <div className="w-1/3 text-center text-white px-2 py-2 rounded outline-none focus:outline-none mr-1 mb-1 bg-blue-900 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
                            <i className="fas fa-edit text-xs "/>
                        </div>
                    </Link>
                ),
            }
        ],[]
    );

    React.useEffect(()=>{
        loadMenus(currentStore.id)  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentStore]);

    React.useEffect(()=>{
        setData(menu.menus)
    },[menu])

    return (
        <div className="flex flex-wrap">
            <div className="w-full px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
                    <div className="rounded-t bg-white mb-0 px-6 py-6 flex justify-between">
                        <h6 className="text-gray-800 text-xl font-bold">Menu</h6>
                        <Link to="/menu/add" className="text-white px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 bg-blue-500 active:bg-blue-600 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
                            New Menu
                        </Link>
                    </div>
                    <div className="flex flex-col">
                        <div>
                            {data ?
                                <Table data={data} totalData={data.length} size={5} columns={columns} searchValue={search}/> :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps,mapDispatchToProps)(MenuList);