import { PageHeader } from "../../../_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";

export default function EditProductPage({ params: {id}}){
    return <>
        <PageHeader>Edit Product</PageHeader>
        <ProductForm/>
    </>
}