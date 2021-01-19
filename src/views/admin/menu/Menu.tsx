import { getCategories } from "api/category";
import { getInventories } from "api/inventory";
import { addMenu, editMenu, getMenuDetail } from "api/menu";
import Input from "components/Input/Input";
import { BASE_PUBLIC_URL } from "config/appConfig";
import React from "react";
import Compress from "react-image-file-resizer";
import { connect } from "react-redux";
import SelectSearch from "react-select-search";
import { ADD_MENU, EDIT_MENU, LOAD_MENU, LOAD_CATEGORIES, LOAD_INVENTORIES } from "store/constants/actionTypes";
import { ImageFile } from "types/imageFile";
import { Menu } from "types/jsonSchema";
import { formatCurrency } from "utils/currencyFormatter";

const mapStateToProps = (state: any) => ({
  currentStore: state.common.currentStore,
  currentMenu: state.menu.currentMenu,
  menuCategory: state.menu.categories,
  inventory: state.inventory.inventories
});

const mapDispatchToProps = (dispatch: any) => ({
  updateMenuAction: async (formData: FormData) =>
    dispatch({ type: EDIT_MENU, payload: editMenu(formData) }),
  addMenuAction: async (formData: FormData) =>
    dispatch({ type: ADD_MENU, payload: addMenu(formData) }),
  loadMenu: async (id: number) =>
    dispatch({ type: LOAD_MENU, payload: getMenuDetail(id) }),
  loadCategories: async (id: number) =>
    dispatch({ type: LOAD_CATEGORIES, payload: getCategories(id)}),
  loadInventories: async (storeId: number) =>
    dispatch({ type: LOAD_INVENTORIES, payload: getInventories(storeId)})
});

const MenuPage = ({
  match,
  currentStore,
  currentMenu,
  updateMenuAction,
  addMenuAction,
  loadMenu,
  menuCategory,
  loadCategories,
  loadInventories,
  inventory
}: any) => {
  const [image, setImage] = React.useState<ImageFile | null>(null);
  const [categories, setCategories] = React.useState([]);
  const [inventories, setInventories] = React.useState<any[]>([]);
  const [newInventories, setNewInventories] = React.useState<any[]>([]);
  const [menu, setMenu] = React.useState<Menu>({
    menuCategoryId: 0,
    inventories: [],
    menuCode: "",
    menuDescription: "",
    menuDiscountType: "fixed",
    menuDiscountValue: 0,
    menuName: "",
    menuPhoto: "",
    menuPrice: 0,
    menuStock: 0,
    storeId: 0,
    isDiscount: false,
  });

  React.useEffect(() => {
    loadInventories(Number(currentStore.id));
    loadCategories(Number(currentStore.id));
    if (match.params.method === "add") {
      setMenu({
        ...menu,
        storeId: Number(currentStore.id),
      });
    } else {
      loadMenu(Number(match.params.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (typeof menuCategory !== "undefined") {
      setCategories(menuCategory);
    }
    if (typeof inventory !== "undefined") {
      setInventories(inventory);
    }
    if (match.params.method !== "add") {
      setMenu(currentMenu);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMenu, menuCategory, inventory]);

  const handleInputNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isNaN(Number(event.target.value))) {
      return;
    }
    const item = {
      ...menu,
      [event.target.id]: Number(event.target.value),
    };
    setMenu(item);
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const item = {
      ...menu,
      [event.target.id]: event.target.value,
    };
    setMenu(item);
  };

  const changePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const photo = event.target.files[0];
      setImage({
        file: photo,
        filename: event.target.files[0].name,
        url: URL.createObjectURL(photo),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(menu)
    let newImage: File | null = null;
    if (image?.file) {
      newImage = await new Promise((resolve) =>
        Compress.imageFileResizer(
          image.file,
          500,
          500,
          "JPEG",
          70,
          0,
          (file) => {
            if (file instanceof Blob) {
              resolve(new File([file], image.filename));
            }
            resolve(null);
          },
          "blob"
        )
      );
    }
    const formData = new FormData();
    const newMenu = menu;
    newMenu.newInventories = newInventories;
    const data = JSON.stringify(newMenu);
    formData.append("data", data);
    if (newImage) formData.append("image", newImage);
    if (match.params.method === "add") {
      return addMenuAction(formData);
    }
    return updateMenuAction(formData);
  };

  const handleFacilitySelect = (id: string | number) => {
    const exist = newInventories.filter((val:any)=>val.id === id).length > 0;
    if (exist) {
      return
    }
    const item = inventories.filter((val:any)=>val.id === id);
    setNewInventories([...newInventories, item[0]])
  }

  const changeInvStock = (item:any, total:number) => {
    const newInv = newInventories;
    item.inventoryTotal = total;
    const itemIndex = newInv.findIndex((i)=>i.id === item.id);
    if (itemIndex !== -1) {
      newInv[itemIndex] = item;
    } else {
      newInv.push(item)
    }
    setNewInventories(newInv);
    console.log(newInventories)
  }

  return (
    <div className="flex flex-wrap">
      <div className="w-full px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <h6 className="text-gray-800 text-xl font-bold">
              {match.params.method === "add" ? "New Menu" : menu.menuName}
            </h6>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleSubmit} action="/">
              <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                Menu Detail
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4 flex flex-col order-last lg:order-first">
                  <div className="relative w-full mb-3">
                    <Input
                      labelText="Name"
                      required
                      type="text"
                      id="menuName"
                      value={menu.menuName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="relative w-full mb-3">
                    <Input
                      labelText="Code"
                      id="menuCode"
                      value={menu.menuCode}
                      onChange={handleInputChange}
                      type="text"
                    />
                  </div>
                  <div className="relative w-full mb-3 flex justify-between">
                    <div className="relative w-full lg:w-1/2 pr-1">
                      <Input
                        labelText="Price"
                        required
                        id="menuPrice"
                        value={menu.menuPrice}
                        onChange={handleInputNumberChange}
                        type="text"
                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      />
                    </div>
                    <div className="relative w-full lg:w-1/2 pl-1">
                      <Input
                        labelText="Stock"
                        required
                        id="menuStock"
                        value={menu.menuStock}
                        onChange={handleInputNumberChange}
                        type="number"
                      />
                    </div>
                  </div>
                  <div className="w-full mb-3 h-full flex flex-col">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                      Category
                    </label>
                    <div className="w-full flex items-end">
                      <SelectSearch
                        search
                        value={`${menu.menuCategoryId}`}
                        autoComplete="on"
                        onChange={(val: any) => setMenu({...menu, menuCategoryId: Number(val)})}
                        placeholder="Search Category"
                        options={categories.map((val: any) => ({
                          value: val.id,
                          name: val.menuCategoryName,
                        }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4 flex flex-col">
                  <div className="relative w-full">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                      Cover Photo
                    </label>
                  </div>
                  {image === null ? (
                    menu.menuPhoto ? (
                      <div className="relative w-full mb-3 flex justify-center">
                        <img
                          className="h-64 object-cover"
                          src={BASE_PUBLIC_URL + menu.menuPhoto}
                          alt="menu-cover"
                        />
                      </div>
                    ) : null
                  ) : (
                    <div className="relative w-full mb-3 flex justify-center">
                      <img
                        className="h-64 object-cover"
                        src={image.url}
                        alt="menu-cover"
                      />
                    </div>
                  )}
                  <div className="relative w-full mb-3">
                    <input
                      type="file"
                      onChange={changePhoto}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>

              <hr className="mt-6 border-b-1 border-gray-400" />

              <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                Additional Information
              </h6>
              <div className="flex flex-wrap">
                <div className="w-1/2">
                  <div className="w-full px-4 flex">
                    <div className="flex-shrink flex flex-col items-center justify-center">
                      <input
                        className="form-checkbox text-gray-800 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        type="checkbox"
                        id="isDiscount"
                        checked={menu.isDiscount}
                        onChange={() =>
                          setMenu({ ...menu, isDiscount: !menu.isDiscount })
                        }
                      />
                    </div>
                    <div className="w-3/4 mb-3 pl-1">
                      <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                        Discount
                      </label>
                      <div
                        className={`${
                          !menu.isDiscount ? "bg-gray-300" : "bg-white"
                        } pl-3 py-3 pr-3 flex justify-between text-gray-700 rounded text-sm shadow  w-full `}
                      >
                        <input
                          disabled={!menu.isDiscount}
                          type="text"
                          value={menu.menuDiscountValue}
                          onChange={(e) => {
                            if (isNaN(Number(e.target.value))) {
                              return;
                            }
                            if (
                              Number(e.target.value) > 100 &&
                              menu.menuDiscountType === "percent"
                            ) {
                              return;
                            }
                            if (
                              Number(e.target.value) > menu.menuPrice &&
                              menu.menuDiscountType === "fixed"
                            ) {
                              return;
                            }
                            const value = e.target.value.replace(/^0+/, "");
                            setMenu({
                              ...menu,
                              menuDiscountValue: Number(value),
                            });
                          }}
                          className=" placeholder-gray-400 focus:outline-none w-20"
                        />
                        <div className="border-l border-gray-400">
                          <select
                            className="focus:outline-none bg-transparent"
                            onChange={(e) => {
                              if (
                                e.target.value === "fixed" ||
                                e.target.value === "percent"
                              ) {
                                setMenu({
                                  ...menu,
                                  menuDiscountType: e.target.value,
                                  menuDiscountValue: 0,
                                });
                              }
                            }}
                            value={menu.menuDiscountType}
                          >
                            <option value="fixed">Rp.</option>
                            <option value="percent">(%)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    {menu.isDiscount ? (
                      <div className="relative mb-3 flex items-center pl-2">
                        <div className="text-xs flex flex-col mt-6">
                          <span>Price after discount</span>
                          <span>
                            {menu.menuDiscountType === "fixed"
                              ? formatCurrency(
                                  menu.menuPrice - menu.menuDiscountValue
                                )
                              : formatCurrency(
                                  menu.menuPrice -
                                    menu.menuPrice *
                                      (menu.menuDiscountValue / 100)
                                )}
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="w-1/2">
                <div className="w-full px-4">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Description
                    </label>
                    <textarea
                      id="menuDescription"
                      value={menu.menuDescription}
                      onChange={handleInputChange}
                      rows={2}
                      style={{ resize: "none" }}
                      wrap="break-word"
                      className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                    />
                  </div>
                </div>
              </div>
              <hr className="mt-6 border-b-1 border-gray-400" />

              <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                Inventories
              </h6>
              <div className="flex flex-wrap">
              <div className="w-full flex items-end">
                        <SelectSearch
                          search
                          autoComplete="on"
                          onChange={(val:any)=>handleFacilitySelect(val)}
                          placeholder="Search Inventory"
                          options={inventories.map((val:any)=> ({
                              value: val.id,
                              name: val.inventoryName
                          }))} />
                      </div>
                      <div className="w-full mt-1 inline-grid grid-cols-2">
                          {
                            newInventories.map((item:any, i:number)=>(
                              <div className="flex py-1 pr-2 justify-between text-sm items-center" key={i}>
                                <span className="font-bold">{`${item.inventoryName} (${item.inventoryUnit})`}</span>
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    value={item.inventoryTotal}
                                    onChange={(e)=>changeInvStock(item, Number(e.target.value))}
                                    placeholder={`Total in ${item.inventoryUnit}`}
                                    className="px-1 py-1 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline ease-linear transition-all duration-150"
                                  />
                                  <i 
                                    onClick={()=>setNewInventories(newInventories.filter((val:any)=> val.id !== item.id))}
                                    className="ml-2 fas fa-times text-red-700 cursor-pointer"></i>
                                </div>
                              </div>
                            ))
                          }
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
