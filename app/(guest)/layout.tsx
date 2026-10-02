import Footer from "@/components/Footer";
import { ReactNode } from "react";

export default function Layout({children}: {children: ReactNode}) {
    return (
        <>
            {children}
            <Footer />
        </>
    )
}