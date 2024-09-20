"use client";
import { Hexagon } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <nav className="mx-3 my-4">
      <div className="flex justify-between">
        <div className="p-2">
          <Hexagon />
        </div>
        <div className="ml-auto flex items-center ">
          <w3m-button />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
