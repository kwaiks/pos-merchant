import { addMedia, getAllMedia, removeMedia } from "api/gallery";
import { BASE_PUBLIC_URL } from "config/appConfig";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { LOAD_IMAGE, ADD_MEDIA, REMOVE_MEDIA } from "store/constants/actionTypes";
import Compress from "react-image-file-resizer";

interface ImageFile {
    file: File;
    filename: string;
    url: string;
}

const mapStateToProps = (state:any) => ({
    currentStore: state.common.currentStore,
    gallery: state.gallery
});

const mapDispatchToProps = (dispatch:any) => ({
    loadImage: async (storeId: number) =>
      dispatch({ type: LOAD_IMAGE, payload: getAllMedia(storeId)}),
    addStoreMedia: async (data: any, image: File) => 
        dispatch({ type: ADD_MEDIA, payload: addMedia(data, image)}),
    removeStoreMedia: async (id: number) =>
        dispatch({ type: REMOVE_MEDIA, payload: removeMedia(id)})
  });

const Gallery = (
    {loadImage, currentStore, gallery, addStoreMedia, removeStoreMedia}:
    {
        addStoreMedia: Function, 
        loadImage: Function, 
        currentStore:any, 
        gallery:any,
        removeStoreMedia:Function
    }) => {
    const [images, setImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [image, setImage] = useState<ImageFile | null>(null);
    const inputHandler = React.createRef<HTMLInputElement>();

    useEffect(()=>{
        loadImage(currentStore.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentStore]);

    useEffect(()=>{
        setImages(gallery.media);
        setModalOpen(gallery.modalOpened);
    },[gallery]);

    const changePhoto = (event:React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
            const image = event.target.files[0];
            setImage({
                file:image,
                filename: event.target.files[0].name,
                url: URL.createObjectURL(image)
            })
        }
    }

    const handleSubmit = async () => {
        let compressedImage: File | null = null;
        if (image && image.file){
            compressedImage = await new Promise((resolve)=>Compress.imageFileResizer(
                image.file,
                500,
                500,
                "JPEG",
                70,
                0,
                (file) => {
                    if (file instanceof Blob){
                    resolve(new File([file], image.file.name));
                    }
                    resolve(null);
                },
            "blob"));
        }
        const data = {
            storeId: currentStore.id,
            mediaType: "image"
        }
        if(image?.file){
            addStoreMedia(data, compressedImage)
        }
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-full px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
                    <div className="rounded-t bg-white mb-0 px-6 py-6">
                        <h6 className="text-gray-800 text-xl font-bold">
                            Gallery
                        </h6>
                    </div>
                    <div className=" px-4 lg:px-10 py-10 pt-3">
                        <div className="inline-grid grid-cols-4 relative w-full" style={{gridAutoRows: "1fr"}}>
                            {
                                images && images.map((item:any,i:number) => (
                                    item.mediaType === "image" ?
                                        <div 
                                            key={item.id}
                                            className="relative w-full cursor-pointer p-1 hover:bg-gray-600 h-48 overflow-hidden flex justify-center">
                                            <img src={BASE_PUBLIC_URL+item.mediaPath}
                                                className="min-h-full w-full object-cover"
                                            alt={`store${i}`}/>
                                            <div
                                                onClick={()=>removeStoreMedia(Number(item.id))} 
                                                className="absolute right-0 bg-white shadow top-0 rounded-full text-center flex justify-center items-center h-8 w-8">
                                                <div>
                                                    <i className="fas text-xs fa-trash text-red-500">
                                                    </i>
                                                </div>
                                            </div>
                                        </div>
                                    : null 
                                ))
                            }
                            <div className="w-full cursor-pointer p-1 hover:bg-gray-600 h-48 overflow-hidden flex justify-center"
                                onClick={()=>setModalOpen(true)}
                            >
                                <div className="h-full w-full bg-white flex justify-center items-center">
                                    <span className="text-6xl">+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal 
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                className="modal-content relative h-auto transition-all duration-300"
                style={{
                    content: {
                        width: "30%",
                        maxHeight: "70%"
                    }
                }}
                onRequestClose={()=> {
                    setImage(null);
                    setModalOpen(false)
                }}
                shouldCloseOnOverlayClick
                isOpen={modalOpen}
            >
                    <div className="flex flex-col h-full">
                        <div className="py-4 text-gray-800 text-lg font-bold">
                            New Media
                        </div>
                    <div className="overflow-scroll flex-grow">
                        <div className="relative w-full mb-3 flex justify-center">
                            {image?.file ? 
                                    <img src={image.url} alt="media" className="object-cover h-64"/>
                            :  null}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-center">
                            <div 
                                className="w-1/2 text-xs btn font-bold text-center"
                                onClick={()=>{
                                    if (inputHandler.current) {
                                        inputHandler.current.click();
                                    }
                                }}
                            >
                                {image?.file ? "Change Image" :  "Upload Image"}
                            </div>
                        </div>  
                        <div 
                            className="btn mt-4 uppercase font-bold text-center"
                            onClick={handleSubmit}
                            >
                            Add Media
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal 
                ariaHideApp={false}
                overlayClassName="modal-overlay"
                className="modal-content relative h-auto transition-all duration-300"
                style={{
                    content: {
                        width: "30%",
                        maxHeight: "70%"
                    }
                }}
                onRequestClose={()=> {
                    setImage(null);
                    setModalOpen(false)
                }}
                shouldCloseOnOverlayClick
                isOpen={modalOpen}
            >
                    <div className="flex flex-col h-full">
                        <div className="py-4 text-gray-800 text-lg font-bold">
                            New Media
                        </div>
                    <div className="overflow-scroll flex-grow">
                        <div className="relative w-full mb-3 flex justify-center">
                            {image?.file ? 
                                    <img src={image.url} alt="media" className="object-cover h-64"/>
                            :  null}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-center">
                            <div 
                                className="w-1/2 text-xs btn font-bold text-center"
                                onClick={()=>{
                                    if (inputHandler.current) {
                                        inputHandler.current.click();
                                    }
                                }}
                            >
                                {image?.file ? "Change Image" :  "Upload Image"}
                            </div>
                        </div>  
                        <div 
                            className="btn mt-4 uppercase font-bold text-center"
                            onClick={handleSubmit}
                            >
                            Add Media
                        </div>
                    </div>
                </div>
            </Modal>
            <input
                className="hidden"
                onChange={changePhoto}
                ref={inputHandler}
                type="file" />
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Gallery);