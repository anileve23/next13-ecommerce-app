'use client'

import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckbox from "@/app/components/inputs/CustomCheckbox";
import Input from "@/app/components/inputs/input";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import { categories } from "@/utils/Categories";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { colors } from "@/utils/Color";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export type ImageType = {
    color: string;
    colorCode: string;
    image: File | null
}

export type UploadedImageType = {
    color: string;
    colorCode: string;
    image: string;
}

const AddProductForm = () => {
        const router = useRouter()
        const [isLoading, setIsLoading] = useState(false)
        const [images, setImages] = useState<ImageType[] | null>()
        const [isProductCreated, setIsProductCreated] = useState(false)

        const {register, handleSubmit, setValue, watch, reset, formState:{errors}} = useForm<FieldValues>({
            defaultValues:{
                name: '',
                description: '',
                brand: '',
                category: '',
                inStock: false,
                images: [],
                price: '',

            }
        })

        useEffect(() => {
            setCustomValue('images', images)
        }, [images])

        useEffect (() => {
            if(isProductCreated){
                reset()
                setImages(null)
                setIsProductCreated(false)
            }
        }, [isProductCreated])

        const onSubmit: SubmitHandler<FieldValues> = async(data) =>{
            console.log("Product Data", data)
            setIsLoading(true)
            let uploadedImages: UploadedImageType[] = []

            if(!data.category){
                setIsLoading(false)
                return toast.error('Category is not selected!')
            }

            if(!data.images || data.images.length === 0){
                setIsLoading(false)
                return toast.error('No selected image!')
            }

const handleImageUploads = async () => {
    toast('Uploading images, please wait...');
    try {
        for (const item of data.images) {
            if (item.image) {
                const formData = new FormData();
                formData.append('file', item.image);
                formData.append('upload_preset', 'e-shop');

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/dds1tikiz/image/upload`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        timeout: 10000,
                    }
                );

                if (response.status === 200) {
                    uploadedImages.push({
                        ...item,
                        image: response.data.secure_url,
                    });
                    console.log('Uploaded to Cloudinary:', response.data.secure_url);
                } else {
                    throw new Error('Image upload failed');
                }
            }
        }
    } catch (error) {
        setIsLoading(false);
        console.error('Error handling image uploads', error);
        return toast.error('Error uploading images to Cloudinary');
    }
};




            await handleImageUploads()
            const productData = {...data, images: uploadedImages}
            
            axios.post('/api/product', productData).then(() => {
                toast.success('Product created')
                setIsProductCreated(true)
                router.refresh()
            }).catch((error) =>{
                toast.error('Something went wrong when saving product to db')
            }).finally(() => {
                setIsLoading(false)
            })
        }

        const category = watch('category')
        const setCustomValue = (id: string, value: any) => {
            setValue(id, value,{
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            })
        }

        const addImageToState = useCallback((value: ImageType) => {
            setImages((prev) => {
                if(!prev){
                    return [value]
                }

                return [...prev, value]
            })
        }, [])

        const removeImageFromState = useCallback((value: ImageType) => {
            setImages((prev) => {
                if (prev) {
                    const filteredImages = prev.filter(
                        (item) => item.color !== value.color
                    )
                    return filteredImages;
                }
                return prev;
            })
        }, []  )

    return ( <>
    <Heading title="Add a Product" center/>
    <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required/>
    <Input id="price" label="Price" disabled={isLoading} register={register} errors={errors} type="number" required/>
    <Input id="brand" label="Brand" disabled={isLoading} register={register} errors={errors} required/>
    <TextArea id="description" label="Description" disabled={isLoading} register={register} errors={errors} required/>
    <CustomCheckbox id="inStock" register={register} label="This product is in stock"/>
    <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a Category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
            {categories.map((item) => {
                if(item.label === 'All'){
                    return null;
                }

                return <div key ={item.label} className="col-span">
                    <CategoryInput onClick={(category) => setCustomValue('category', category)}
                        selected={category === item.label}
                        label={item.label}
                        icon={item.icon}/>
                </div>
            })}
        </div>
    </div>
    <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
        <div className="font-bold">
            Select the available product colors and upload their images.
        </div>
        <div className="text-sm">
            You must upload an image for each of the color selected otherwise your color selection will be ignored.
        </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            {colors.map((item, index) => {
                return <SelectColor key={index} item={item} addImageToState={addImageToState} removeImageFromState={removeImageFromState} isProductCreated = {isProductCreated}/>
            })}
        </div>
        </div>
        <Button label={isLoading? 'Loading...': 'Add Product' } onClick={handleSubmit(onSubmit)}/>
    </> );
}
 
export default AddProductForm;