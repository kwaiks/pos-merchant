import { addInventory, editInventory, getInventoryDetail } from "api/inventory";
import Input from "components/Input/Input";
import React from "react";
import { connect } from "react-redux";
import SelectSearch from "react-select-search";
import { ADD_INVENTORY, EDIT_INVENTORY, LOAD_INVENTORY } from "store/constants/actionTypes";
import { Inventory } from "types/jsonSchema";

const mapStateToProps = (state: any) => ({
  currentStore: state.common.currentStore,
  currentInv: state.inventory.currentInv
});

const mapDispatchToProps = (dispatch: any) => ({
  updateInventory: async (formData: FormData) =>
    dispatch({ type: EDIT_INVENTORY, payload: editInventory(formData) }),
  addInventoryAction: async (formData: FormData) =>
    dispatch({ type: ADD_INVENTORY, payload: addInventory(formData) }),
  loadInventory: async (id: number) =>
    dispatch({ type: LOAD_INVENTORY, payload: getInventoryDetail(id) }),
});

const MenuPage = ({
  match,
  currentStore,
  currentInv,
  updateInventory,
  addInventoryAction,
  loadInventory,
}: any) => {
  const [inventory, setInventory] = React.useState<Inventory>({
    inventoryCode:"",
    inventoryMinStock:0,
    inventoryName:"",
    inventoryPrice:0,
    inventoryStock:0,
    inventoryUnit:"kg",
    storeId: 0
  });

  React.useEffect(() => {
    if (match.params.method === "add") {
      setInventory({
        ...inventory,
        storeId: Number(currentStore.id),
      });
    } else {
      loadInventory(Number(match.params.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (match.params.method !== "add") {
      setInventory(currentInv);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInv]);

  const handleInputNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isNaN(Number(event.target.value))) {
      return;
    }
    const item = {
      ...inventory,
      [event.target.id]: Number(event.target.value),
    };
    setInventory(item);
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const item = {
      ...inventory,
      [event.target.id]: event.target.value,
    };
    setInventory(item);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (match.params.method === "add") {
      return addInventoryAction(inventory);
    }
    return updateInventory(inventory);
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <h6 className="text-gray-800 text-xl font-bold">
              {match.params.method === "add" ? "New Inventory" : inventory.inventoryName}
            </h6>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleSubmit} action="/">
              <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
              Inventory Detail
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full px-4 flex flex-col order-last lg:order-first">
                  <div className="flex w-full mb-3">
                    <div className="w-6/12 pr-1">
                      <Input
                        labelText="Name"
                        required
                        type="text"
                        id="inventoryName"
                        value={inventory.inventoryName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="w-6/12 pl-1">
                      <Input
                        labelText="Code"
                        id="inventoryCode"
                        value={inventory.inventoryCode}
                        onChange={handleInputChange}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex w-full mb-3">
                    <div className="w-6/12 pr-1">
                      <Input
                          labelText="Price"
                          required
                          id="inventoryPrice"
                          value={inventory.inventoryPrice}
                          onChange={handleInputNumberChange}
                          type="text"
                          className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        />
                    </div>
                    <div className="w-6/12 pl-1">
                    <Input
                        labelText="Stock"
                        required
                        id="inventoryStock"
                        value={inventory.inventoryStock}
                        onChange={handleInputNumberChange}
                        type="text"
                      />
                    </div> 
                  </div>
                  <div className="relative w-full mb-3 flex justify-between">
                    <div className="relative w-full lg:w-1/2 pr-1">
                      <Input
                        labelText="Minimum Stock"
                        required
                        id="inventoryMinStock"
                        value={inventory.inventoryMinStock}
                        onChange={handleInputNumberChange}
                        type="text"
                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      />
                    </div>
                    <div className="relative w-full lg:w-1/2 pl-1">
                      <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                        Unit
                      </label>
                      <SelectSearch
                          search
                          className="select-search"
                          value={`${inventory.inventoryUnit}`}
                          autoComplete="on"
                          onChange={(val: any) => setInventory({...inventory, inventoryUnit: val})}
                          placeholder="Search Category"
                          options={[
                            {
                              name: "Kg",
                              value: "kg",
                            },
                            {
                              name: "gr",
                              value: "gr",
                            },
                            {
                              name: "ml",
                              value: "ml",
                            }
                          ]}
                        />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-right px-4">
                <button
                  className="text-white px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 bg-blue-500 active:bg-blue-600 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage);
