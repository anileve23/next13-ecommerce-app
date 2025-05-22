'use client'

import Link from "next/link";
import Container from "../Container";
import { Redressed } from "next/font/google";
import CartCount from "./CartCount";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/actions/getCurrentUser";
import SearchBar from "./SearchBar";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Categories = dynamic(() => import("./Categories"), { ssr: false });

const redressed = Redressed({ subsets: ['latin'], weight: ['400'] });

const NavBar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="sticky top-0 w-full bg-slate-200 z-30 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex itmes-center justify-between gap-3 md:gap-0">
            <Link href='/' className={`${redressed.className} font-bold text-2xl`}>
              E-Shop
            </Link>
            <div className="hidden md:block"><SearchBar /></div>
            <div className="flex items-center gap-8 md:gap-12">
              <CartCount />
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>
      <Suspense fallback={null}>
        <Categories />
      </Suspense>
    </div>
  );
}

export default NavBar;
