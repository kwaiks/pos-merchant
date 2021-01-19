import React from "react";

export default function ImageViewer(
    {src}:
    {src: string}
) {
    const [viewer, setViewer] = React.useState(false);
    return (
        <>
        {/* <img
            src={src}
            alt={src}
        ></img> */}
        <div className={`block absolute top-0 left-0 h-full w-full z-50 bg-black bg-opacity-50`}>
            <div className="bg-white">Tes</div>
        </div>
        </>
    );
}