import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Attractions from './pages/traveler/Attractions';
import Profile from './pages/traveler/Profile';
import Booking from './pages/traveler/Booking';
import UserRegister from './pages/UserRegister';
import AttractionsInfo from './pages/traveler/AttractionsInfo';
import AddAttractions from './pages/dashboard/AddAttractions';
import BookingInfo from './pages/traveler/BookingInfo';
import BookingList from './pages/traveler/BookingList';
import AddBusiness from './pages/business/AddBusiness';
import Reviews from './pages/business/Reviews';
import BusUpdate from './pages/business/Update';
import Login from './pages/login';
import Test from './pages/Tests';
import Dashboard from './pages/dashboard/Dashboard';
import AiGuide from './pages/traveler/AiGuide';
import NewRFID from './pages/dashboard/NewRFID';
import Tracking from './pages/dashboard/Tracking';
import RfidList from './pages/dashboard/RfidList';
import Location from './pages/dashboard/Location';
import UpdateAttraction from './pages/dashboard/UpdateAttraction';
import Guides from './pages/dashboard/guides';
import Business from './pages/dashboard/business';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/user/register' element={<UserRegister />} />
          <Route path='/user/profile' element={<Profile />} />
          <Route path='/user/' element={<Attractions />} />
          <Route path='/user/location' element={<AttractionsInfo />} />

          <Route path='/user/booking' element={<Booking />} />
          <Route path='/user/booking/info' element={<BookingInfo />} />
          <Route path='/user/booking/list' element={<BookingList />} />

          <Route path='/business/add' element={<AddBusiness />} />
          <Route path='/business/review' element={<Reviews />} />
          <Route path='/business/update' element={<BusUpdate />} />

          <Route path='/user/guide' element={<AiGuide />} />
          <Route path='/user/dashboard/rfid' element={<AiGuide />} />


          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/locations' element={<Location />} />
          <Route path='/admin/add-locations' element={<AddAttractions />} />
          <Route path="/admin/update-location/:id" element={<UpdateAttraction />} />
          <Route path='/admin/business' element={<Business />} />
          <Route path='/admin/add-rfid' element={<NewRFID />} />
          <Route path='/admin/rfid' element={<RfidList />} />
          <Route path='/admin/tracking' element={<Tracking />} />
          <Route path='/admin/guides' element={<Guides />} />

          <Route path='/test' element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
