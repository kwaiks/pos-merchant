export interface Menu {
    id?: number;
    storeId: number;
    menuName: string;
    menuPhoto: string;
    menuPrice: number;
    menuStock: number;
    menuDescription: string;
    menuCode: string;
    menuDiscountValue: number;
    menuDiscountType: "percent" | "fixed";
    menuCategoryId: number;
    inventories?: any[];
    newInventories?: any[];
    isDiscount: boolean;
}

export interface StoreCategory {
    id: number;
    storeCategoryName: string;
}

export interface Facility {
    id: number;
    facilityName: string;
    facilityIcon: string;
}

interface Province {
    id: number;
    provinceName: string;
}

export interface Store {
    id?: number;
    ownerId: number;
    provinceId?: number;
    province?: Province;
    storeName: string;
    storeLocation: string;
    storePicture?: string;
    storeDescription?: string;
    storePhone: string;
    storeLat: number;
    storeLng: number;
    storeTax?: number;
    storeServiceFee?: number;
    storeOpenTime?: string;
    storeCloseTime?: string;
    category?: StoreCategory[];
    facility?: Facility[];
    userEmail?: string;
    newCategories?: StoreCategory[];
    newFacilities?: Facility[];
}

export interface User {
    userEmail: string;
    userFirstName: string;
    userPassword?: string;
    userLastName: string;
    userPhoneNumber: string;
}

export interface Inventory {
    storeId: number;
    inventoryName: string;
    inventoryMinStock: number;
    inventoryStock: number;
    inventoryPrice: number;
    inventoryUnit: string;
    inventoryCode: string;
}