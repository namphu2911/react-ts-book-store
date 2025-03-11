import { Outlet } from "react-router-dom";
import AppHeader from "components/layout/app.header";
import { useState } from "react";

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <>
      <AppHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Outlet context={[searchTerm, setSearchTerm]} />
    </>
  )
}

export default Layout
