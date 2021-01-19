import Table from "components/Table/Table";
import React from "react";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { LOAD_INVENTORIES } from "store/constants/actionTypes";
import { BASE_PUBLIC_URL } from "config/appConfig";
import { formatCurrency } from "utils/currencyFormatter";
import { getInventories } from "api/inventory";

const mapStateToProps = (state:any) => ({
    currentStore: state.common.currentStore,
    inventory: state.inventory
});

const mapDispatchToProps = (dispatch: any) => ({
    loadInventory: async (storeId: number) =>
        dispatch({type: LOAD_INVENTORIES, payload: getInventories(storeId)})
});

const InventoryList = (
    {currentStore, inventory, loadInventory}:
    {currentStore: any, inventory: any, loadInventory: Function}
    ) => {
    const [data, setData] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const columns = React.useMemo<Column[]>(()=>
        [
            {
                Header: 'Name',
                accessor: 'inventoryName',
            },
            {
                Header: 'Stock',
                accessor: (d: any) => `${d.inventoryStock} ${d.inventoryUnit}`
            },
            {
                Header: 'Minimum Stock',
                accessor: (d: any) => `${d.inventoryMinStock} ${d.inventoryUnit}`
            },
            {
                Header: 'Price',
                accessor: (d:any) => `${formatCurrency(d.inventoryPrice)}`
            },
            {
                Header: 'Action',
                accessor: 'id',
                Cell: ({value}:any) => (
                    <Link to={`/inventory/edit/${value}`}>
                        <div className="w-1/3 text-center text-white px-2 py-2 rounded outline-none focus:outline-none mr-1 mb-1 bg-blue-900 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
                            <i className="fas fa-edit text-xs "/>
                        </div>
                    </Link>
                ),
            }
        ],[]
    );

    React.useEffect(()=>{
        loadInventory(currentStore.id)  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentStore]);

    React.useEffect(()=>{
        setData(inventory.inventories)
    },[inventory])

    return (
        <div className="flex flex-wrap">
            <div className="w-full px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
                    <div className="rounded-t bg-white mb-0 px-6 py-6 flex justify-between">
                        <h6 className="text-gray-800 text-xl font-bold">Inventory</h6>
                        <Link to="/inventory/add" className="text-white px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 bg-blue-500 active:bg-blue-600 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
                            New Inventory
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

export default connect(mapStateToProps,mapDispatchToProps)(InventoryList);