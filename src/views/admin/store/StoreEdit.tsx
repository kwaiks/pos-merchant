import React, { 
  useState, 
  ChangeEvent, 
  FormEvent,
  useEffect
} from "react";
import Compress from "react-image-file-resizer";
import moment from "moment";
import { connect } from "react-redux";
import TimePicker from 'rc-time-picker';
import SelectSearch from 'react-select-search';

import { Store } from "types/jsonSchema";
import { editStore, getStoreById } from "api/store";
import { BASE_PUBLIC_URL } from "config/appConfig";
import Input from "components/Input/Input";
import { EDIT_STORE, LOAD_FACILITIES, LOAD_STORE, LOAD_STORE_CATEGORIES } from "store/constants/actionTypes";
import { ImageFile } from "types/imageFile";
import { getFacilities, getStoreCategory } from "api/master";

const mapStateToProps = (state:any) => ({
  currentStore:state.common.currentStore,
  master: state.store
});

const mapDispatchToProps = (dispatch:any) => ({
  onSubmit: async (data: FormData) =>
    dispatch({ type: EDIT_STORE, payload: editStore(data)}),
  loadStore: async (id: number) => 
    dispatch({ type: LOAD_STORE, payload: getStoreById(id)}),
  loadFacilities: async () => 
    dispatch({ type: LOAD_FACILITIES, payload: getFacilities()}),
  loadCategory: async () => 
    dispatch({ type: LOAD_STORE_CATEGORIES, payload: getStoreCategory()})
});

const StorePage = ({loadStore, currentStore, master, onSubmit, loadFacilities, loadCategory}:any) => {
  const [coverPhoto, setCoverPhoto] = useState<ImageFile | null>(null);
  const [storeCategories, setStoreCategories] = useState([]);
  const [storeFacilities, setStoreFacilities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [store, setStore] = useState<Store>({
    id: 0,
    storeName: "",
    storeLocation: "",
    storePhone: "",
    storeDescription: "",
    storeServiceFee: 0,
    storeTax: 0,
    ownerId: 0,
    storeLat: 0,
    storeLng: 0,
    provinceId: 1,
    storeOpenTime: moment().format("HH:mm"),
    storeCloseTime: moment().format("HH:mm")
  });

  useEffect(()=>{
    loadCategory();
    loadFacilities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    if(master.store){
      setStore(master.store)
      setStoreFacilities(master.store.facility);
      setStoreCategories(master.store.category);
    }
    setFacilities(master.facility);
    setCategories(master.category);
  },[master])

  useEffect(()=>{
    loadStore(currentStore.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentStore])

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newImage: File | null = null;
    if (coverPhoto?.file){
      newImage = await new Promise((resolve)=>Compress.imageFileResizer(
          coverPhoto.file,
          500,
          500,
          "JPEG",
          70,
          0,
          (file) => {
            if (file instanceof Blob){
              resolve(new File([file], coverPhoto.filename));
            }
            resolve(null);
          },
          "blob"));
    }
    const formData = new FormData();
    const newStore = store;

    //Validation
    newStore.storeLat = Number(newStore.storeLat);
    newStore.storeLng = Number(newStore.storeLng);
    newStore.storeTax = Number(newStore.storeTax);
    newStore.storeCloseTime = newStore.storeCloseTime? newStore.storeCloseTime: "";
    newStore.storeOpenTime = newStore.storeOpenTime? newStore.storeOpenTime: "";
    newStore.storeServiceFee = Number(newStore.storeServiceFee);
    newStore.storeDescription = newStore.storeDescription ? newStore.storeDescription : "";
    newStore.newFacilities = storeFacilities;
    newStore.newCategories = storeCategories;
    const data = JSON.stringify(newStore);
    formData.append("data", data);
    if (newImage) formData.append("image", newImage);
    onSubmit(formData);
  }

  const changePhoto = (event:ChangeEvent<HTMLInputElement>) => {
    if(event.target.files) {
      const image = event.target.files[0];
      setCoverPhoto({
        file:image,
        filename: event.target.files[0].name,
        url: URL.createObjectURL(image)
      })
    }
  }

  const handleInputNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(event.target.value))){
      return;
    }
    const item = {
      ...store,
      [event.target.id]: Number(event.target.value)
    }
    setStore(item);
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const item = {
      ...store,
      [event.target.id]: event.target.value
    }
    setStore(item);
  }

  const handleCategorySelect = (id: string | number) => {
      const exist = storeCategories.filter((val:any)=>val.id === id).length > 0;
      if (exist || storeCategories.length >= 4) {
        return
      }
      const item = categories.filter((val:any)=>val.id === id);
      setStoreCategories([...storeCategories, item[0]])
  }

  const handleFacilitySelect = (id: string | number) => {
    const exist = storeFacilities.filter((val:any)=>val.id === id).length > 0;
    if (exist || storeFacilities.length >= 4) {
      return
    }
    const item = facilities.filter((val:any)=>val.id === id);
    setStoreFacilities([...storeFacilities, item[0]])
  }

  return (
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
              <h6 className="text-gray-800 text-xl font-bold">
                {store.storeName}
              </h6>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={handleSubmit} action="/">
              <h6 className="text-gray-500 text-sm mt-3 mb-6 font-bold uppercase">
                Store Information
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4 flex flex-col order-last lg:order-first">
                  <div className="relative w-full mb-3">
                    <Input
                      labelText="Store Name"
                      required
                      type="text"
                      id="storeName"
                      value={store.storeName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="relative w-full mb-3">
                    <Input
                      labelText="Phone Number"
                      required
                      id="storePhone"
                      value={store.storePhone}
                      onChange={handleInputChange}
                      type="text"
                    />
                  </div>
                  <div className="relative w-full mb-3 flex justify-between">
                    <div className="relative w-full lg:w-1/2 pr-1">
                      <Input
                        labelText="Latitude"
                        required
                        id="storeLat"
                        value={store.storeLat}
                        onChange={handleInputNumberChange}
                        type="text"
                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      />
                    </div>
                    <div className="relative w-full lg:w-1/2 pl-1">
                      <Input
                        labelText="Longitude"
                        required
                        id="storeLng"
                        value={store.storeLng}
                        onChange={handleInputNumberChange}
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Address
                    </label>
                    <textarea
                      required
                      id="storeLocation"
                      value={store.storeLocation}
                      onChange={handleInputChange}
                      rows={3}
                      style={{resize:"none"}}
                      wrap= "break-word"
                      className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4 flex flex-col">
                  <div className="relative w-full">
                    <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      >
                        Cover Photo
                      </label>
                  </div>
                  {
                    coverPhoto === null ?
                    ( store.storePicture ? 
                      <div className="relative w-full mb-3">
                      <img src={BASE_PUBLIC_URL+store.storePicture} alt="store-cover"/>
                    </div> : null )
                       :
                    <div className="relative w-full mb-3">
                      <img src={coverPhoto.url} alt="store-cover"/>
                    </div>
                  }
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
                <div className="w-full lg:w-6/12 px-4 flex flex-col">
                  <div className="w-full px-4 mb-3 h-full flex flex-col">
                        <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                    >
                        Facilities
                    </label>
                      <div className="w-full flex items-end">
                        <SelectSearch
                          search
                          autoComplete="on"
                          onChange={(val:any)=>handleFacilitySelect(val)}
                          placeholder="Search Category"
                          options={facilities.map((val:any)=> ({
                              value: val.id,
                              name: val.facilityName
                          }))} />
                           <span className="ml-1 text-gray-700 text-sm font-bold ">{storeFacilities.length}/4</span>
                      </div>
                      <div className="w-full mt-1 inline-grid grid-cols-2">
                          {
                            storeFacilities.map((item:any, i:number)=>(
                              <div className="flex py-1 pr-2 justify-between text-sm items-center">
                                <span className="font-bold">{item.facilityName}</span>
                                <i 
                                  onClick={()=>setStoreFacilities(storeFacilities.filter((val:any)=> val.id !== item.id))}
                                  className="fas fa-times text-red-700 cursor-pointer"></i>
                              </div>
                            ))
                          }
                      </div>
                    </div>
                    <div className="w-full px-4 mb-2 h-full flex flex-col">
                        <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                    >
                        Categories
                    </label>
                      <div className="w-full flex items-end">
                        <SelectSearch
                          search
                          autoComplete="on"
                          onChange={(val:any)=>handleCategorySelect(val)}
                          placeholder="Search Category"
                          options={categories.map((val:any)=> ({
                              value: val.id,
                              name: val.storeCategoryName
                          }))} />
                           <span className="ml-1 text-gray-700 text-sm font-bold ">{storeCategories.length}/4</span>
                      </div>
                      <div className="w-full mt-1 inline-grid grid-cols-2">
                          {
                            storeCategories.map((item:any, i:number)=>(
                              <div className="flex py-1 pr-2 justify-between text-sm items-center">
                                <span className="font-bold">{item.storeCategoryName}</span>
                                <i 
                                  onClick={()=>setStoreCategories(storeCategories.filter((val:any)=> val.id !== item.id))}
                                  className="fas fa-times text-red-700 cursor-pointer"></i>
                              </div>
                            ))
                          }
                      </div>
                    </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3" >
                    <div className="relative w-full flex justify-between">
                        <div className="relative w-full mb-3 pr-1">
                            <Input
                              labelText="Service Fee (%)"
                              id="storeServiceFee"
                              value={store.storeServiceFee}
                              type="text"
                              placeholder="0.00"
                              onChange={handleInputNumberChange}
                            />
                          </div>
                          <div className="relative w-full mb-3 pl-1">
                            <Input
                              labelText="Tax (%)"
                              id="storeTax"
                              value={store.storeTax}
                              onChange={handleInputNumberChange}
                              type="text"
                              placeholder="0.00"
                              className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                            />
                          </div>
                    </div>
                  </div>
                <div className="relative w-full mb-3">
                  <div className="relative w-full mb-3 flex justify-between">
                      <div className="relative w-full lg:w-1/2 pr-1">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Open Time
                        </label>
                        <TimePicker 
                          id="storeOpenTime"
                          className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                          showSecond={false}
                          onChange={(val)=> {
                              if (val !== null) {
                                return setStore({
                                  ...store,
                                  storeOpenTime: val.format("HH:mm")
                                });
                              }
                              return setStore({
                                ...store,
                                storeOpenTime: moment().format("HH:mm")
                              });
                          }}
                          value={moment(store.storeOpenTime, "HH:mm")}
                        />
                      </div>
                      <div className="relative w-full lg:w-1/2 pl-1">
                        <label
                          className="block uppercase text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Close Time
                        </label>
                        <TimePicker 
                          id="storeCloseTime"
                          className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                          showSecond={false}
                          onChange={(val)=> {
                              if (val !== null) {
                                return setStore({
                                  ...store,
                                  storeCloseTime: val.format("HH:mm")
                                });
                              }
                              return setStore({
                                ...store,
                                storeCloseTime: moment().format("HH:mm")
                              });
                          }}
                          value={moment(store.storeCloseTime, "HH:mm")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                        <label
                              className="block uppercase text-gray-700 text-xs font-bold mb-2"
                              htmlFor="grid-password"
                            >
                              Description
                            </label>
                            <textarea
                              id="storeDescription"
                              value={store.storeDescription}
                              onChange={handleInputChange}
                              rows={5}
                              style={{resize:"none"}}
                              wrap= "break-word"
                              className="px-3 pt-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                            />
                    </div>
                </div>
              </div>

              <div className="mt-3 text-right px-4">
                <button 
                  className="text-white px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 bg-blue-500 active:bg-blue-600 text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                  type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StorePage);
