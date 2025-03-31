import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Attractions from './pages/traveler/Attractions';
import Profile from './pages/traveler/Profile';
import Booking from './pages/traveler/Booking';
import UserRegister from './pages/UserRegister';
import GuideRegister from './pages/GuideRegister';
import BusinessmanRegister from './pages/BusinessmanRegister'
import AttractionsInfo from './pages/traveler/AttractionsInfo';
import AddAttractions from './pages/dashboard/AddAttractions';
import BookingInfo from './pages/traveler/BookingInfo';
import BookingList from './pages/traveler/BookingList';
import AddBusiness from './pages/business/AddBusiness';
import Reviews from './pages/business/Reviews';
import BusUpdate from './pages/business/Update';
import Login from './pages/Login';
import Test from './pages/Tests';
import Dashboard from './pages/dashboard/Dashboard';
import AiGuide from './pages/traveler/AiGuide';
import NewRFID from './pages/dashboard/NewRFID';
import Tracking from './pages/dashboard/Tracking';
import RfidList from './pages/dashboard/RfidList';
import Location from './pages/dashboard/Location';
import UpdateAttraction from './pages/dashboard/UpdateAttraction';
import Guides from './pages/dashboard/Guides';
import Business from './pages/dashboard/Business';
import UpdateRFID from './pages/dashboard/UpdateRFID';
import Scanner from './pages/traveler/Scaner';
import PrivateRoute from './components/PrivateRoute';
import Logout from './pages/Logout';
import Businesslist from './pages/business/Businesslist';
import UserBusinesslist from './pages/business/UserBusinesslist';
export default function App() {
  return (
    <>
      <Router>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register1" element={<UserRegister />} />
          <Route path="/register2" element={<GuideRegister />} />
          <Route path="/register3" element={<BusinessmanRegister />} />

          <Route path="/user/" element={<PrivateRoute element={<Attractions />} allowedUserType="tourist" />} />
          <Route path='/user/profile' element={<PrivateRoute element={<Profile />} allowedUserType="tourist" />} />
          <Route path='/user/booking' element={<PrivateRoute element={<Booking />} allowedUserType="tourist" />} />
          <Route path='/user/location/:id' element={<PrivateRoute element={<AttractionsInfo />} allowedUserType="tourist" />} />
          <Route path='/user/booking/info' element={<PrivateRoute element={<BookingInfo />} allowedUserType="tourist" />} />
          <Route path='/user/booking/list' element={<PrivateRoute element={<BookingList />} allowedUserType="tourist" />} />
          <Route path='/user/scaner' element={<PrivateRoute element={<Scanner />} allowedUserType="tourist" />} />
          <Route path='/user/guide' element={<PrivateRoute element={<AiGuide />} allowedUserType="tourist" />} />

          <Route path="/admin/dashboard" element={<PrivateRoute element={<Dashboard />} allowedUserType="admin" />} />
          <Route path="/admin/locations" element={<PrivateRoute element={<Location />} allowedUserType="admin" />} />
          <Route path="/admin/add-locations" element={<PrivateRoute element={<AddAttractions />} allowedUserType="admin" />} />
          <Route path="/admin/update-location/:id" element={<PrivateRoute element={<UpdateAttraction />} allowedUserType="admin" />} />
          <Route path="/admin/business" element={<PrivateRoute element={<Business />} allowedUserType="admin" />} />
          <Route path="/admin/add-rfid" element={<PrivateRoute element={<NewRFID />} allowedUserType="admin" />} />
          <Route path="/admin/rfid" element={<PrivateRoute element={<RfidList />} allowedUserType="admin" />} />
          <Route path="/update-rfid/:id" element={<PrivateRoute element={<UpdateRFID />} allowedUserType="admin" />} />
          <Route path="/admin/tracking" element={<PrivateRoute element={<Tracking />} allowedUserType="admin" />} />
          <Route path="/admin/guides" element={<PrivateRoute element={<Guides />} allowedUserType="admin" />} />

          <Route path='/business/add' element={<AddBusiness />} />
          <Route path='/business/userbusinesslist' element={<UserBusinesslist />} />
          <Route path='/business/list' element={<Businesslist/>}/>
          <Route path="/403" element={<Test />} />

        </Routes>
      </Router>
    </>
  );
}

