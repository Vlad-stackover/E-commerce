import { Nav, NavLink } from '@/components/Nav';
import cn from 'classnames';
import { Inter } from 'next/font/google';


export const dynamic = "force-dynamic"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        <Nav>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/orders">My Orders</NavLink>
    
        </Nav>
        <div className='container my-6'>{children}</div>
    </>
}
