import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ToastContainer } from "react-toastify";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Calendar from "./scenes/calendar/calendar";
import Geography from "./scenes/geography";
import Assets from "./scenes/assets";
import ViewAsset from "./scenes/assets/ViewAsset";
import List_Location from "./scenes/location/List_Location";
import List_Category from "./scenes/category/List_Category";
import List_subCategory from "./scenes/subCategory/List_subCategory";
import List_Department from "./scenes/department/List_Department";
import List_Vendor from "./scenes/vendor/List_Vendor";
import List_User from "./scenes/users/List_User";
// import Add_Asset from "./scenes/form";
import List_Condition from "./scenes/condition/List_Condition";
import Checkout from "./scenes/check-in-out/Checkout";
import Checkin from "./scenes/check-in-out/Checkin";
import EditAsset from "./scenes/assets/EditAsset";
import AddAsset from "./scenes/assets/AddAsset";
import Info_Asset from "./scenes/users/Info_Asset";
import SignIn from "./scenes/login/Login";
import DefaulLayout from "./scenes/layout/DefaulLayout";
import List_AssetBrand from "./scenes/asset-Brand/List_AssetBrand";
import Samplepage from "./scenes/form";
import AssetByTagId from "./scenes/reports/AssetReport/AssetByTagId";
import AssetByCategory from "./scenes/reports/AssetReport/AssetByCategory";
import AssetByWarrantyInfo from "./scenes/reports/AssetReport/AssetByWarrantyInfo";
import CheckOutByTagId from "./scenes/reports/CheckOutReport/CheckOutByTagId";
import CheckOutByUser from "./scenes/reports/CheckOutReport/CheckOutByUser";
import AssetByDepartment from "./scenes/reports/AssetReport/AssetByDepartment";
import MaintenanceByAssetTag from "./scenes/reports/MaintenanceReport/MaintenanceByAssetTag";
import MaintenanceByPerson from "./scenes/reports/MaintenanceReport/MaintenanceByPerson";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <DefaulLayout>
                <Dashboard />
              </DefaulLayout>
            }
          />
          <Route
            path="/assets"
            element={
              <DefaulLayout>
                <Assets />
              </DefaulLayout>
            }
          />
          <Route
            path="/team"
            element={
              <DefaulLayout>
                <Team />
              </DefaulLayout>
            }
          />
          <Route
            path="/invoices"
            element={
              <DefaulLayout>
                <Invoices />
              </DefaulLayout>
            }
          />
          <Route
            path="/viewAsset/:id"
            element={
              <DefaulLayout>
                <ViewAsset />
              </DefaulLayout>
            }
          />
          <Route
            path="/editAsset/:id"
            element={
              <DefaulLayout>
                <EditAsset />
              </DefaulLayout>
            }
          />
          <Route
            path="/addAsset"
            element={
              <DefaulLayout>
                <AddAsset />
              </DefaulLayout>
            }
          />

          <Route
            path="/checkout/:id"
            element={
              <DefaulLayout>
                <Checkout />
              </DefaulLayout>
            }
          />
          <Route
            path="/checkin/:id"
            element={
              <DefaulLayout>
                <Checkin />
              </DefaulLayout>
            }
          />

          <Route
            path="/location"
            element={
              <DefaulLayout>
                <List_Location />
              </DefaulLayout>
            }
          />

          <Route
            path="/assetbrand"
            element={
              <DefaulLayout>
                <List_AssetBrand />
              </DefaulLayout>
            }
          />

          <Route
            path="/category"
            element={
              <DefaulLayout>
                <List_Category />
              </DefaulLayout>
            }
          />

          <Route
            path="/subcategory"
            element={
              <DefaulLayout>
                <List_subCategory />
              </DefaulLayout>
            }
          />

          <Route
            path="/department"
            element={
              <DefaulLayout>
                <List_Department />
              </DefaulLayout>
            }
          />
          <Route
            path="/condition"
            element={
              <DefaulLayout>
                <List_Condition />
              </DefaulLayout>
            }
          />

          <Route
            path="/vendor"
            element={
              <DefaulLayout>
                <List_Vendor />
              </DefaulLayout>
            }
          />

          <Route
            path="/user"
            element={
              <DefaulLayout>
                <List_User />
              </DefaulLayout>
            }
          />
          <Route
            path="/assetInfo/:id"
            element={
              <DefaulLayout>
                <Info_Asset />
              </DefaulLayout>
            }
          />
          <Route
            path="/calendar"
            element={
              <DefaulLayout>
                <Calendar />
              </DefaulLayout>
            }
          />
          <Route
            path="/faq"
            element={
              <DefaulLayout>
                <FAQ />
              </DefaulLayout>
            }
          />
          <Route
            path="/index"
            element={
              <DefaulLayout>
                <Samplepage />
              </DefaulLayout>
            }
          />

          {/* Report Section */}

          <Route
            path="/assetsbyassettag"
            element={
              <DefaulLayout>
                <AssetByTagId />
              </DefaulLayout>
            }
          />

          <Route
            path="/assetsbycategory"
            element={
              <DefaulLayout>
                <AssetByCategory />
              </DefaulLayout>
            }
          />

          <Route
            path="/assetsbydepartment"
            element={
              <DefaulLayout>
                <AssetByDepartment />
              </DefaulLayout>
            }
          />

          <Route
            path="/assetbywarrantyinfo"
            element={
              <DefaulLayout>
                <AssetByWarrantyInfo />
              </DefaulLayout>
            }
          />

          <Route
            path="/checkoutbyassettag"
            element={
              <DefaulLayout>
                <CheckOutByTagId />
              </DefaulLayout>
            }
          />
          <Route
            path="/checkoutbyuser"
            element={
              <DefaulLayout>
                <CheckOutByUser />
              </DefaulLayout>
            }
          />

          <Route
            path="/maintenancebyassettag"
            element={
              <DefaulLayout>
                <MaintenanceByAssetTag />
              </DefaulLayout>
            }
          />
          <Route
            path="/maintenancebyperson"
            element={
              <DefaulLayout>
                <MaintenanceByPerson />
              </DefaulLayout>
            }
          />

          {/* <Route path="/form" element={<DefaulLayout><Form /></DefaulLayout>} /> */}
          <Route
            path="/bar"
            element={
              <DefaulLayout>
                <Bar />
              </DefaulLayout>
            }
          />
          <Route
            path="/pie"
            element={
              <DefaulLayout>
                <Pie />
              </DefaulLayout>
            }
          />
          <Route
            path="/line"
            element={
              <DefaulLayout>
                <Line />
              </DefaulLayout>
            }
          />

          <Route
            path="/geography"
            element={
              <DefaulLayout>
                <Geography />
              </DefaulLayout>
            }
          />
        </Routes>
        <ToastContainer />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
