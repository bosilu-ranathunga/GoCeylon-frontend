import React from 'react'
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
import BookingHistory from './pages/traveler/BookingHistory';
import Scaner from './pages/traveler/Scaner'
import AiGuide from './pages/traveler/AiGuide';

import Dashboard from './pages/dashboard/Dashboard';
import Business from './pages/dashboard/Business';
import Guides from './pages/dashboard/Guides';
import Location from './pages/dashboard/Location';
import AddLocation from './pages/dashboard/AddAttractions';
import RfidList from './pages/dashboard/RfidList';
import AddRfid from './pages/dashboard/NewRFID';
import Tracking from './pages/dashboard/Tracking';

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
          <Route path='/dashboard/add-location' element={<AddAttractions />} />

          <Route path='/user/booking' element={<Booking />} /> {/*2 */}
          <Route path='/user/booking/info' element={<BookingInfo />} />{/* 3*/}
          <Route path='/user/booking/list' element={<BookingList />} />{/* 1*/}
          <Route path='/user/bookinghistory' element={<BookingHistory />} />{/*4 */}

          <Route path='/user/scaner' element={<Scaner />} />

          <Route path='/business/add' element={<AddBusiness />} />
          <Route path='/business/review' element={<Reviews />} />
          <Route path='/business/update' element={<BusUpdate />} />

          <Route path='/user/guide' element={<AiGuide />} />
          <Route path='/user/dashboard/rfid' element={<AiGuide />} />


          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/business' element={<Business />} />
          <Route path='/admin/add-locations' element={<AddLocation />} />
          <Route path='/admin/locations' element={<Location />} />
          <Route path='/admin/guides' element={<Guides />} />
          <Route path='/admin/add-rfid' element={<AddRfid />} />
          <Route path='/admin/rfid' element={<Tracking />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

