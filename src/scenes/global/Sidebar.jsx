import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  // ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
// import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListIcon from "@mui/icons-material/List";
import ReorderIcon from "@mui/icons-material/Reorder";
import SegmentIcon from "@mui/icons-material/Segment";
import GridViewIcon from "@mui/icons-material/GridView";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CircleIcon from "@mui/icons-material/Circle";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [open, setOpen] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openAssetReport, setOpenAssetReport] = useState(false);
  const [openCheckOutReport, setOpenCheckOutReport] = useState(false);
  const [openMaintenanceReport, setOpenMaintenanceReport] = useState(false);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(
      selected
    )} - Asset Tracking System`;
  }, [selected]);

  const handleClickSetup = () => {
    setOpen(!open);
  };

  const handleClickReport = () => {
    setOpenReport(!openReport);
  };

  const handleClickAssetReport = () => {
    setOpenAssetReport(!openAssetReport);
  };

  const handleClickCheckOutReport = () => {
    setOpenCheckOutReport(!openCheckOutReport);
  };

  const handleClickMaintenanceReport = () => {
    setOpenMaintenanceReport(!openMaintenanceReport);
  };

  return (
    <Box
      // position={""}
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },

        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h5" color={colors.grey[100]}>
                  Asset Tracking System
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Ed Roh
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  VP Fancy Admin
                </Typography>
              </Box>
            </Box>
          )} */}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Asset
            </Typography>
            <Item
              title="Assets"
              to="/assets"
              icon={<ListIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="Manage Team"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices Balances"
              to="/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <List>
              <ListItemButton onClick={handleClickSetup}>
                <ListItemText primary="Setup" sx={{ color: "#3d3d3d" }} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Item
                  title="Location"
                  to="/location"
                  icon={<LocationOnIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Asset Brand"
                  to="/assetbrand"
                  icon={<AddToQueueIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Category"
                  to="/category"
                  icon={<ReorderIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Sub-Category"
                  to="/subcategory"
                  icon={<SegmentIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Department"
                  to="/department"
                  icon={<GridViewIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Condition"
                  to="/condition"
                  icon={<SettingsSuggestIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Vendor"
                  to="/vendor"
                  icon={<AddBusinessOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="User"
                  to="/user"
                  icon={<PersonAddOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/* <Item
                  title="Profile Form"
                  to="/form"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                <Item
                  title="Calendar"
                  to="/calendar"
                  icon={<CalendarTodayOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="FAQ Page"
                  to="/faq"
                  icon={<HelpOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Sample Page"
                  to="/index"
                  icon={<CheckBoxOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Collapse>
            </List>
            {/* Report Section */}
            <List>
              <ListItemButton onClick={handleClickReport}>
                <ListItemText primary="Report" sx={{ color: "#3d3d3d" }} />
                {openReport ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openReport} timeout="auto" unmountOnExit>
                <List>
                  <ListItemButton onClick={handleClickAssetReport}>
                    <ListItemText
                      primary="Asset Report"
                      sx={{ color: "#3d3d3d" }}
                    />
                    {openAssetReport ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openAssetReport} timeout="auto" unmountOnExit>
                    <Item
                      title="by Asset Tag"
                      to="/assetsbyassettag"
                      icon={<CircleIcon style={{ fontSize: "5px" }} />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="by Category"
                      to="/assetsbycategory"
                      icon={<CircleIcon style={{ fontSize: "5px" }} />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="by Department"
                      to="/assetsbydepartment"
                      icon={<CircleIcon style={{ fontSize: "5px" }} />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="by Warranty Info"
                      to="/assetbywarrantyinfo"
                      icon={<CircleIcon style={{ fontSize: "5px" }} />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </Collapse>
                </List>
                <List>
                  <ListItemButton onClick={handleClickCheckOutReport}>
                    <ListItemText
                      primary="Check-Out Report"
                      sx={{ color: "#3d3d3d" }}
                    />
                    {openCheckOutReport ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse
                    in={openCheckOutReport}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Item
                      title="by Asset Tag"
                      to="/checkoutbyassettag"
                      icon={<CircleIcon style={{ fontSize: "5px" }} />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="by User/Employee"
                      to="/checkoutbyuser"
                      icon={<CircleIcon style={{ fontSize: "5px" }} />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </Collapse>
                </List>
                <List>
                  <ListItemButton onClick={handleClickMaintenanceReport}>
                    <ListItemText
                      primary="Maintenance Report"
                      sx={{ color: "#3d3d3d" }}
                    />
                    {openMaintenanceReport ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse
                    in={openMaintenanceReport}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Item
                      title="by Asset Tag"
                      to="/maintenancebyassettag"
                      icon={<CircleIcon style={{ fontSize: "5px" }} />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                    <Item
                      title="by Assign Person"
                      to="/maintenancebyperson"
                      icon={<CircleIcon style={{ fontSize: "5px" }} />}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </Collapse>
                </List>
              </Collapse>
            </List>

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
